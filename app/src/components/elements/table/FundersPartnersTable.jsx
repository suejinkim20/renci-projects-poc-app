import React from "react";
import { flexRender } from "@tanstack/react-table";

export const FundersPartnersTable = ({ table }) => {
  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "6px 10px",
    textAlign: "left",
    verticalAlign: "top",
    wordWrap: "break-word", // allow wrapping
    whiteSpace: "normal",   // allow text to wrap
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 12,
    tableLayout: "fixed", // ensures min/max widths are respected
  };


  return (
    <table style={tableStyle}>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={`headerGroup-${hg.id}`}>
            {hg.headers.map((header) => (
              <th key={`header-${header.id}`} style={thStyle}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={`row-${row.id}`}>
            {row.getVisibleCells().map((cell) => (
              <td key={`cell-${cell.id}`} style={thTdStyle}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
