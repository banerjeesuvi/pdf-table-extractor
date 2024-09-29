"use client"

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

interface PrimeDataTableProps {
  data: string[][]
}

export function PrimeDataTable({ data }: PrimeDataTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [rows, setRows] = useState(10);

  const headers = data[0];
  const rows_data = data.slice(1).map((row, index) => {
    const rowData: { [key: string]: string } = { id: index.toString() };
    headers.forEach((header, i) => {
      rowData[header] = row[i];
    });
    return rowData;
  });

  const columns = headers.map((header) => ({
    field: header,
    header: header,
  }));

  const onColumnToggle = (event: { value: string[] }) => {
    const selectedColumns = event.value;
    setSelectedColumns(selectedColumns);
  };

  const header = (
    <div className="flex justify-between items-center">
      <h5 className="m-0">Extracted Table Data</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Global Search"
        />
      </span>
    </div>
  );

  const columnComponents = selectedColumns.length > 0
    ? selectedColumns.map((col) => <Column key={col} field={col} header={col} sortable filter />)
    : columns.map((col) => <Column key={col.field} field={col.field} header={col.header} sortable filter />);

  return (
    <div className="card">
      <MultiSelect
        value={selectedColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
        placeholder="Select Columns"
        className="w-full mb-2"
      />
      <DataTable
        value={rows_data}
        paginator
        rows={rows}
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        filters={{ global: { value: globalFilter, matchMode: 'contains' } }}
        header={header}
        emptyMessage="No data found."
        responsiveLayout="scroll"
        className="w-full"
      >
        {columnComponents}
      </DataTable>
      <div className="flex justify-end mt-2">
        <Dropdown
          value={rows}
          options={[10, 25, 50]}
          onChange={(e) => setRows(e.value)}
          placeholder="Rows per page"
        />
      </div>
    </div>
  );
}