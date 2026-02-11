import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ProjectTable({ rows = [] }) {
  if (!rows.length) return <p>No projects available.</p>;

  // SVG arrow component
  const Arrow = ({ isDesc }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isDesc ? "rotate(180deg)" : "none",
        transition: "transform 0.2s",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        // default sorted column header
        header: ({ column }) => {
          const sorted = column.getIsSorted(); // "asc" | "desc" | false
          const isDesc = sorted === "desc";

          return (
            <span
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                maxWidth: "100px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={() => {
                // if currently asc → switch to desc
                if (sorted === "asc") {
                  column.toggleSorting(true);
                } else {
                  // force asc (no unsort state)
                  column.toggleSorting(false);
                }
              }}
            >
              Project
              <Arrow isDesc={isDesc} />
            </span>
          );
        },
      },
      // ───────────────────────────── Active ─────────────────────────────
      {
        header: "Active",
        accessorKey: "active",
        cell: ({ row }) => {
          return (
            row.original.active == 1 ? "Active" : "Inactive"
          );
        },
      },

      // ───────────────────────────── Funders ─────────────────────────────
      {
        header: "Funders",
        accessorKey: "fundersWithCount",
        cell: ({ row }) => {
          const funders = row.original.fundersWithCount || [];
          if (!funders.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {funders.map((f) => (
                <li key={`${row.original.slug}-funder-${f.id}`}>
                  {f.slug ? (
                    <a
                      href={`https://renci.org/organization/${f.slug}`}
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

      // ───────────────────────────── Partners ─────────────────────────────
      {
        header: "Partners",
        accessorKey: "partnersWithCount",
        cell: ({ row }) => {
          const partners = row.original.partnersWithCount || [];
          if (!partners.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {partners.map((p) => (
                <li key={`${row.original.slug}-partner-${p.id}`}>
                  {p.slug ? (
                    <a
                      href={`https://renci.org/organization/${p.slug}`}
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

      // ───────────────────────────── Staff ─────────────────────────────
      {
        header: "Staff",
        accessorKey: "staffDetails",
        cell: ({ row }) => {
          const staff = row.original.staffDetails || [];
          if (!staff.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {staff.map((s) => (
                <li key={`${row.original.slug}-staff-${s.id}`}>
                  {s.slug ? (
                    <a
                      href={`https://renci.org/person/${s.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "none" }}
                    >
                      {s.name}
                    </a>
                  ) : (
                    s.name
                  )}
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

  // Default sort by project title ASC
  const table = useReactTable({
    data: rows,
    columns,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Styles
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
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} style={thStyle}>
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
    </div>
  );
}
