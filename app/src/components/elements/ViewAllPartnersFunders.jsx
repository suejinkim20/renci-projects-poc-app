import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { TableHeaderInput } from "./table/TableHeaderInput"
import { TableHeaderSelect } from "./table/TableHeaderSelect"
import { FundersPartnersTable } from "./table/FundersPartnersTable"

export default function ViewAllPartnersFunders({ rows = [] }) {
  if (!rows.length) return <p>No projects found.</p>;

  const [type, setType] = useState("funders");
  const [columnFilters, setColumnFilters] = useState([]);

  const { funders, partners, allResearchGroups } = useMemo(() => {
    const funderMap = {};
    const partnerMap = {};
    const researchGroupSet = new Set();

    rows.forEach((project) => {
      const projRef = {
        id: project.id,
        title: project.title,
        staffDetails: project.staffDetails || [],
        operationsGroup: project.operationsGroup || null,
      };

      (project.fundersWithCount || []).forEach((f) => {
        if (!funderMap[f.name]) funderMap[f.name] = { name: f.name, url: f.url, projects: [] };
        funderMap[f.name].projects.push(projRef);
      });

      (project.partnersWithCount || []).forEach((p) => {
        if (!partnerMap[p.name]) partnerMap[p.name] = { name: p.name, url: p.url, projects: [] };
        partnerMap[p.name].projects.push(projRef);
      });

      (project.staffDetails || []).forEach((s) => {
        if (s.researchGroupName) researchGroupSet.add(s.researchGroupName);
      });
    });

    return {
      funders: Object.values(funderMap),
      partners: Object.values(partnerMap),
      allResearchGroups: Array.from(researchGroupSet).sort(),
    };
  }, [rows]);

  const data = type === "funders" ? funders : partners;

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: (props) => <TableHeaderInput column={props.column} label="Organization" placeholder="Filter..." />,
        cell: ({ row }) =>
          row.original.url ? (
            <a
              href={row.original.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              {row.original.name}
            </a>
          ) : (
            row.original.name
          ),
        minSize: 150,
        maxSize: 300,
        enableResizing: true,

      },
      {
        accessorKey: "projects",
        sortingFn: (a, b) => a.original.projects.length - b.original.projects.length,
        header: (props) => <TableHeaderInput column={props.column} label="Project Count" type="number" placeholder="Min..." />,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return row.original.projects.length >= filterValue;
        },
        cell: ({ row }) => row.original.projects.length,
        minSize: 50,
        maxSize: 60,
        enableResizing: true,

      },
      {
        header: "Projects",
        cell: ({ row }) =>
          row.original.projects.length === 0 ? (
            "—"
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {row.original.projects.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          ),
        minSize: 300,
        maxSize: 400,
        enableResizing: true,
      },
      {
        id: "researchGroups",
        accessorFn: (row) =>
          row.projects.flatMap((p) => (p.staffDetails || []).map((s) => s.researchGroupName).filter(Boolean)),
        header: (props) => (
          <TableHeaderSelect column={props.column} label="Research Groups" options={allResearchGroups} multiple />
        ),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValues) => {
          if (!filterValues || !filterValues.length) return true;
          const groups = row.getValue(columnId);
          return groups.some((g) => filterValues.includes(g));
        },
        cell: ({ row }) => {
          const groups = row.original.projects.flatMap((p) => (p.staffDetails || []).map((s) => s.researchGroupName).filter(Boolean));
          const unique = [...new Set(groups)];
          if (!unique.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {unique.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          );
        },
        minSize: 300,
        maxSize: 400,
        enableResizing: true,

      },
      // {
      //   accessorKey: "operationsGroup",
      //   header: (props) => <TableHeaderInput column={props.column} label="Operations Group" placeholder="Filter..." />,
      //   cell: ({ row }) => row.original.operationsGroup || "—",
      // },
    ],
    [type, allResearchGroups]
  );

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnFilters: [],
      columnSizing: {},
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      {/* Toggle + Reset Filters */}
      <div style={{ margin: "1rem 0.5rem", display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "8px" }}>
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
        <button
          onClick={() => setColumnFilters([])}
          style={{
            padding: "6px 12px",
            background: "#f87171",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reset Filters
        </button>
      </div>

      <FundersPartnersTable table={table} />
    </div>
  );
}
