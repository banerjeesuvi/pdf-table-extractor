"use client"

import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import { PrimeDataTable } from '../components/PrimeDataTable'
import { PrimeReactProvider } from 'primereact/api';

// Import PrimeReact styles
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Home() {
  const [tableData, setTableData] = useState<string[][]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to process PDF: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setTableData(data)
    } catch (error) {
      console.error('Error extracting table data:', error)
    }
    setIsLoading(false)
  }

  return (
    <PrimeReactProvider>
      <main className="flex min-h-screen flex-col p-5">
        <h1 className="text-4xl font-bold mb-8">PDF Table Extractor</h1>
        <FileUpload onFileUpload={handleFileUpload} />
        {isLoading && <div className="card flex justify-content-center">
            <ProgressSpinner />
        </div>}
        {tableData.length > 0 && <PrimeDataTable data={tableData} />}
      </main>
    </PrimeReactProvider>
  )
}