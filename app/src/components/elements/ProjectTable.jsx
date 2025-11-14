import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ProjectTable({ rows = [] }) {
  if (!rows.length) return <p>No projects available.</p>;

  const columns = useMemo(
    () => [
      {
        header: "Project",
        accessorKey: "title",
      },
      {
        header: "Funders",
        accessorKey: "fundersWithCount",
        cell: ({ row }) => {
          const funders = row.original.fundersWithCount || [];
          if (!funders.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {funders.map((f) => (
                <li key={f.name}>
                  {f.url ? (
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "none" }}
                    >
                      {f.name}
                    </a>
                  ) : (
                    f.name
                  )}
                </li>
              ))}
            </ul>
          );
        },
      },
      {
        header: "Partners",
        accessorKey: "partnersWithCount",
        cell: ({ row }) => {
          const partners = row.original.partnersWithCount || [];
          if (!partners.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {partners.map((p) => (
                <li key={p.name}>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "none" }}
                    >
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </li>
              ))}
            </ul>
          );
        },
      },
      {
        header: "Staff",
        accessorKey: "staffDetails",
        cell: ({ row }) => {
          const staff = row.original.staffDetails || [];
          if (!staff.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {staff.map((s) => (
                <li key={s.name}>
                  {s.name}
                  {s.affiliation ? ` (${s.affiliation})` : ""}
                </li>
              ))}
            </ul>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "8px 10px",
    textAlign: "left",
    verticalAlign: "top",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f9f9f9",
    fontWeight: "bold",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={thStyle}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={thTdStyle}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
