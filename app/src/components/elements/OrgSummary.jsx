import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function OrgSummary({ rows = [] }) {
  if (!rows.length) return <p>No projects found.</p>;

  const projectCount = rows.length;

  // ──────────────────────────────────────────
  // Aggregate data
  const allStaff = rows.flatMap((r) => r.staffDetails || []);
  const uniqueStaffCount = new Set(allStaff.map((s) => s.name)).size;

  const allFunders = rows.flatMap((r) => r.fundersWithCount || []);
  const funderMap = {};
  allFunders.forEach((f) => {
    if (!f.name) return;
    funderMap[f.name] = funderMap[f.name] || { count: 0, url: f.url || null };
    funderMap[f.name].count += f.count;
  });

  const allPartners = rows.flatMap((r) => r.partnersWithCount || []);
  const partnerMap = {};
  allPartners.forEach((p) => {
    if (!p.name) return;
    partnerMap[p.name] = partnerMap[p.name] || { count: 0, url: p.url || null };
    partnerMap[p.name].count += p.count;
  });

  // Affiliation summary (optional future use)
  const affiliationMap = {};
  allStaff.forEach((s) => {
    const key = s.affiliation || "Unassigned";
    affiliationMap[key] = (affiliationMap[key] || 0) + 1;
  });

  // ──────────────────────────────────────────
  // Prepare TanStack table data
  const funderData = Object.entries(funderMap).map(([name, obj]) => ({
    name,
    count: obj.count,
    url: obj.url || null,
  }));

  const partnerData = Object.entries(partnerMap).map(([name, obj]) => ({
    name,
    count: obj.count,
    url: obj.url || null,
  }));

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const { name, url } = row.original;
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0366d6", textDecoration: "underline" }}
            >
              {name}
            </a>
          ) : (
            name
          );
        },
      },
      {
        header: "Project Count",
        accessorKey: "count",
      },
    ],
    []
  );

  const funderTable = useReactTable({
    data: funderData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const partnerTable = useReactTable({
    data: partnerData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ──────────────────────────────────────────
  // Styles
  const cardStyle = {
    background: "#ffffff",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    minWidth: "12vw",
    maxWidth: "35vw",
  };

  const containerStyle = {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "6px 10px",
    textAlign: "left",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const renderTable = (tableInstance) => (
    <table style={tableStyle}>
      <thead>
        {tableInstance.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={thStyle}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " ▲",
                  desc: " ▼",
                }[header.column.getIsSorted()] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {tableInstance.getRowModel().rows.map((row) => (
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
  );

  // ──────────────────────────────────────────
  return (
    <div>
      {/* Summary cards */}
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div>Total Active Projects</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {projectCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div>Unique Staff Contributors</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {uniqueStaffCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div>Unique Funding Organizations</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {Object.keys(funderMap).length}
          </div>
        </div>

        <div style={cardStyle}>
          <div>Unique Partner Organizations</div>
          <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
            {Object.keys(partnerMap).length}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        {funderData.length > 0 && (
          <div style={cardStyle}>
            <div
              style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "1.1rem" }}
            >
              Funders Summary
            </div>
            {renderTable(funderTable)}
          </div>
        )}

        {partnerData.length > 0 && (
          <div style={cardStyle}>
            <div
              style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "1.1rem" }}
            >
              Partners Summary
            </div>
            {renderTable(partnerTable)}
          </div>
        )}
      </div>
    </div>
  );
}
