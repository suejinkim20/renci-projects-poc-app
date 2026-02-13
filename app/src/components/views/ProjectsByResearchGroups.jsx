import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";

import { RESEARCH_GROUPS_QUERY } from "../../lib/graphql/queries";
import { buildProjectRowsFromResearchGroup } from "../../data/adapters/projectRowsFromResearchGroups";

import { ProjectTable } from "../elements/ProjectTable";
import Modal from "../elements/Modal";
import SummaryPanel from "../elements/SummaryPanel";

import { TableHeaderInput } from "../elements/table/TableHeaderInput";
import { TableHeaderSelect } from "../elements/table/TableHeaderSelect";

import { Select, Button, Stack, Group, Pagination } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";

export default function ProjectsByResearchGroups() {
  const [selectedIndex, setSelectedIndex] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  // ── Data
  const { data, loading, error } = useQuery(RESEARCH_GROUPS_QUERY);
  const researchGroups = data?.research_groups ?? [];

  const selectedGroup = selectedIndex !== "" ? researchGroups[selectedIndex] : null;
  const rows = useMemo(
    () => (selectedGroup ? buildProjectRowsFromResearchGroup(selectedGroup) : []),
    [selectedGroup]
  );

  // ── Columns
  const columns = useMemo(() => [
    {
      accessorKey: "title",
      header: (props) => <TableHeaderInput column={props.column} label="Project" />,
      filterFn: "includesString",
    },
    {
      accessorKey: "active",
      header: (props) => <TableHeaderSelect column={props.column} label="Active" options={["Active", "Inactive"]} />,
      cell: ({ row }) => (Number(row.original.active) === 1 ? "Active" : "Inactive"),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const isActive = Number(row.original.active) === 1;
        return filterValue === "Active" ? isActive : !isActive;
      },
    },
    {
      accessorKey: "fundersWithCount",
      header: (props) => <TableHeaderInput column={props.column} label="Funders" />,
      cell: ({ row }) => {
        const funders = row.original.fundersWithCount || [];
        if (!funders.length) return "—";
        return (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {funders.map((f) => (
              <li key={`${row.original.slug}-funder-${f.id}`}>
                {f.slug ? (
                  <a
                    href={`https://renci.org/organization/${f.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
      accessorKey: "partnersWithCount",
      header: (props) => <TableHeaderInput column={props.column} label="Partners" />,
      cell: ({ row }) => {
        const partners = row.original.partnersWithCount || [];
        if (!partners.length) return "—";
        return (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {partners.map((p) => (
              <li key={`${row.original.slug}-partner-${p.id}`}>
                {p.slug ? (
                  <a
                    href={`https://renci.org/organization/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
      accessorKey: "staffDetails",
      header: (props) => <TableHeaderInput column={props.column} label="Staff" />,
      cell: ({ row }) => {
        const staff = row.original.staffDetails || [];
        if (!staff.length) return "—";
        return (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {staff.map((s) => (
              <li key={`${row.original.slug}-staff-${s.id}`}>
                {s.slug ? (
                  <a
                    href={`https://renci.org/person/${s.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
  ], []);


  // ── Table instance with pagination
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { sorting: [{ id: "title", desc: false }], pagination: { pageSize: 10 } },
  });

  if (loading) return <p>Loading research groups…</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <Stack spacing="md">
      <Select
        label="Select Research Group"
        placeholder="Pick one"
        data={researchGroups.map((rg, idx) => ({ value: String(idx), label: rg.name }))}
        value={selectedIndex}
        onChange={setSelectedIndex}
      />

      {selectedGroup && (
        <>
          <Group spacing="sm">
            <Button onClick={() => setShowSummary(true)} leftIcon={<IconFileText size={16} />}>
              View Summary
            </Button>
          </Group>

          <ProjectTable table={table} />

          {/* Pagination */}
          {rows.length > 10 && (
            <Group position="center" mt="md">
              <Pagination
                total={table.getPageCount()}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(page) => table.setPageIndex(page - 1)}
              />
            </Group>
          )}
        </>
      )}

      {showSummary && (
        <Modal opened={showSummary} onClose={() => setShowSummary(false)}>
          <SummaryPanel rows={rows} onClose={() => setShowSummary(false)} />
        </Modal>
      )}
    </Stack>
  );
}
