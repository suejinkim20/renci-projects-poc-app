import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ViewAllPartnersFunders({ rows = [] }) {
  if (!rows.length) return <p>No projects found.</p>;

  // Toggle state
  const [type, setType] = useState("funders"); // "funders" | "partners"

  // Build org summaries from project rows
  const { funders, partners } = useMemo(() => {
    const funderMap = {};
    const partnerMap = {};

    rows.forEach((project) => {
      const projRef = {
        id: project.id,
        title: project.title,
        staffDetails: project.staffDetails || [],
      };

      (project.fundersWithCount || []).forEach((f) => {
        if (!funderMap[f.name]) {
          funderMap[f.name] = { name: f.name, url: f.url, projects: [] };
        }
        funderMap[f.name].projects.push(projRef);
      });

      (project.partnersWithCount || []).forEach((p) => {
        if (!partnerMap[p.name]) {
          partnerMap[p.name] = { name: p.name, url: p.url, projects: [] };
        }
        partnerMap[p.name].projects.push(projRef);
      });
    });

    return {
      funders: Object.values(funderMap),
      partners: Object.values(partnerMap),
    };
  }, [rows]);

  const data = type === "funders" ? funders : partners;

  // Table Columns — 4 column spec
  const columns = useMemo(
    () => [
      {
        header: "Organization",
        accessorKey: "name",
        cell: ({ row }) => {
          const original = row.original;
          return original.url ? (
            <a
              href={original.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              {original.name}
            </a>
          ) : (
            original.name
          );
        },
      },

      {
        header: "Project Count",
        accessorKey: "projects",
        sortingFn: (a, b) =>
          a.original.projects.length - b.original.projects.length,
        cell: ({ row }) => row.original.projects.length,
      },

      {
        header: "Projects",
        cell: ({ row }) => {
          const projects = row.original.projects;
          if (!projects.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {projects.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          );
        },
      },

      {
        header: "Research Groups",
        cell: ({ row }) => {
          const groups = row.original.projects.flatMap((p) =>
            (p.staffDetails || [])
              .map((s) => s.researchGroupName)
              .filter(Boolean)
          );

          const unique = [...new Set(groups)];

          if (!unique.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {unique.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          );
        },
      },
    ],
    [type]
  );

  // Table instance
  const table = useReactTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: "name", desc: false }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Styles
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
  };
  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "6px 10px",
    textAlign: "left",
    verticalAlign: "top",
  };
  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div>
      {/* Toggle Buttons */}
      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
        <button
          onClick={() => setType("funders")}
          style={{
            padding: "6px 12px",
            background: type === "funders" ? "#2563eb" : "#e5e7eb",
            color: type === "funders" ? "#fff" : "#000",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Funders
        </button>
        <button
          onClick={() => setType("partners")}
          style={{
            padding: "6px 12px",
            background: type === "partners" ? "#2563eb" : "#e5e7eb",
            color: type === "partners" ? "#fff" : "#000",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Partners
        </button>
      </div>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={thStyle}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === "desc"
                      ? " ▼"
                      : " ▲"
                    : ""}
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
