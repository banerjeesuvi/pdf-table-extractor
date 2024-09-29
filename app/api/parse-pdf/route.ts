import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const chunks = [];
    for await (const chunk of (request as any).body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const pdfData = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.on("pdfParser_dataReady", resolve);
      pdfParser.parseBuffer(buffer);
    });

    const text = (pdfData as any).Pages.map((page: any) => 
      page.Texts.map((text: any) => decodeURIComponent(text.R[0].T)).join(' ')
    ).join('\n');

    const prompt = `
      Extract the tabular data from the following text and format it as a JSON array of arrays. 
      The first array should contain the column headers, and the subsequent arrays should contain the row data.
      Only include the actual table data, no additional text or explanations.
      Text from PDF:
      ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content in the response');
    }

    const jsonData = JSON.parse(content);
    if (Array.isArray(jsonData) && jsonData.every(Array.isArray)) {
      return NextResponse.json(jsonData);
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};