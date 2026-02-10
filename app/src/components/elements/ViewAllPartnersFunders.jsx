import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { TableHeaderInput } from "./table/TableHeaderInput";
import { TableHeaderSelect } from "./table/TableHeaderSelect";
import { FundersPartnersTable } from "./table/FundersPartnersTable";

export default function ViewAllPartnersFunders({ rows = [] }) {
  const [columnFilters, setColumnFilters] = useState([]);

  if (!rows.length) {
    return <p>No organizations found.</p>;
  }

  /**
   * Collect unique research groups once for the filter dropdown
   */
  const allResearchGroups = useMemo(() => {
    const set = new Set();

    rows.forEach((org) => {
      org.projects.forEach((p) => {
        p.staffDetails?.forEach((s) => {
          if (s.researchGroupName) {
            s.researchGroupName
              .split(",")
              .map((g) => g.trim())
              .forEach((g) => set.add(g));
          }
        });
      });
    });

    return Array.from(set).sort();
  }, [rows]);

  /**
   * Table column definitions
   */
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: (props) => (
          <TableHeaderInput
            column={props.column}
            label="Organization"
            placeholder="Filter…"
          />
        ),
        cell: ({ row }) =>
          row.original.slug ? (
            <a
              href={`https://renci.org/organization/${row.original.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              {row.original.name}
            </a>
          ) : (
            row.original.name
          ),
        minSize: 180,
      },

      {
        accessorKey: "relationship",
        header: (props) => (
          <TableHeaderSelect
            column={props.column}
            label="Relationship"
            options={["Funder", "Partner", "Both", "Neither"]}
          />
        ),
        filterFn: (row, columnId, filterValues) => {
          if (!filterValues?.length) return true;
          return filterValues.includes(row.getValue(columnId));
        },
        minSize: 120,
      },

      {
        id: "projectCount",
        accessorFn: (row) => row.projects.length,
        header: (props) => (
          <TableHeaderInput
            column={props.column}
            label="Project Count"
            type="number"
            placeholder="Min…"
          />
        ),
        filterFn: (row, columnId, value) =>
          !value || row.getValue(columnId) >= value,
        cell: ({ getValue }) => getValue(),
        minSize: 80,
      },

      {
        header: "Projects",
        cell: ({ row }) =>
          row.original.projects.length ? (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {row.original.projects.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          ) : (
            "—"
          ),
        minSize: 320,
      },

      {
        id: "researchGroups",
        accessorFn: (row) => {
          const groups = [];

          row.projects.forEach((p) => {
            p.staffDetails?.forEach((s) => {
              if (s.researchGroupName) {
                s.researchGroupName
                  .split(",")
                  .map((g) => g.trim())
                  .forEach((g) => groups.push(g));
              }
            });
          });

          return [...new Set(groups)];
        },
        header: (props) => (
          <TableHeaderSelect
            column={props.column}
            label="Research Groups"
            options={allResearchGroups}
            multiple
          />
        ),
        filterFn: (row, columnId, filterValues) => {
          if (!filterValues?.length) return true;
          const groups = row.getValue(columnId) || [];
          return groups.some((g) => filterValues.includes(g));
        },
        cell: ({ getValue }) => {
          const groups = getValue();
          if (!groups?.length) return "—";
          return (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {groups.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          );
        },
        minSize: 300,
      },
    ],
    [allResearchGroups]
  );

  /**
   * Table instance
   */
  const table = useReactTable({
    data: rows,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      sorting: [{ id: "name", desc: false }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div
        style={{
          margin: "1rem 0.5rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
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
