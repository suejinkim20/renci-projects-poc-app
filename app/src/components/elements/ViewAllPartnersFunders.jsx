import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Button,
  Group,
  Stack,
  Pagination,
  Text,
  Paper,
  Center,
} from "@mantine/core";

import { TableHeaderInput } from "./table/TableHeaderInput";
import { TableHeaderSelect } from "./table/TableHeaderSelect";
import { FundersPartnersTable } from "./table/FundersPartnersTable";

export default function ViewAllPartnersFunders({ rows = [] }) {
  const [columnFilters, setColumnFilters] = useState([]);

  if (!rows.length) {
    return (
      <Center mt="xl">
        <Text>No organizations found.</Text>
      </Center>
    );
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
   * Columns (unchanged)
   */
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        size: 500,
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
            >
              {row.original.name}
            </a>
          ) : (
            row.original.name
          ),
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
      },
      {
        id: "projects",
        accessorFn: (row) => row.projects.map((p) => p.title),
        header: (props) => (
          <TableHeaderInput
            column={props.column}
            label="Projects"
            placeholder="Search projects…"
          />
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const projectTitles = row.getValue(columnId) || [];
          return projectTitles.some((title) =>
            title.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
        cell: ({ getValue }) => {
          const projects = getValue();
          if (!projects.length) return "—";
          return (
            <ul>
              {projects.map((title, idx) => (
                <li key={`project-${idx}`}>{title}</li>
              ))}
            </ul>
          );
        },
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
            <ul>
              {groups.map((g) => (
                <li key={`research-group-${g}`}>{g}</li>
              ))}
            </ul>
          );
        },
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
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <Paper shadow="xs" p="md" radius="md">
      <Stack gap="md">
        {/* Reset Button */}
        <Group justify="flex-end">
          <Button
            color="red"
            variant="light"
            onClick={() => setColumnFilters([])}
          >
            Reset Filters
          </Button>
        </Group>

        {/* Table */}
        <FundersPartnersTable table={table} />

        {/* Pagination */}
        <Group justify="center">
          <Pagination
            total={pageCount}
            value={pageIndex + 1}
            onChange={(page) => table.setPageIndex(page - 1)}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
