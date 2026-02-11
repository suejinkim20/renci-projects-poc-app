import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={`headerGroup-${headerGroup.id}`}>
            {headerGroup.headers.map(header => (
              <th
                key={`header-${header.id}`}
                className="border border-gray-300 px-3 py-2 text-left bg-gray-100"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={`row-${row.id}`}>
            {row.getVisibleCells().map(cell => (
              <td key={`cell-${cell.id}`} className="border border-gray-300 px-3 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
