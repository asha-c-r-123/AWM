import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Test() {
  const [columns, setColumns] = useState([
        {field: 'code', header: 'Code', width:200},
        {field: 'name', header: 'Name', width:100},
        {field: 'category', header: 'Category', width:100},
        {field: 'quantity', header: 'Quantity', width:300}
    ]);

    const data = [
    {code:'ABC', name: 'HH' , category:"no", quantity:1}
    ]


  const onColumnResizeEnd = (event) => {
  console.log("in test event", event);
    const updatedColumns = [...columns];
    const resizedColumn = updatedColumns.find((col) => col.field === event.element.getAttribute('data-pr-field'));
    resizedColumn.width = event.width;
    setColumns(updatedColumns);
  };

  return (
    <DataTable value={data} resizableColumns columnResizeMode="expand"
      onColumnResizeEnd={onColumnResizeEnd}>
      {columns.map((col) => (
        <Column key={col.field} field={col.field} header={col.header} style={{ width: col.width }} />
      ))}
    </DataTable>
  );
}

export default Test;
