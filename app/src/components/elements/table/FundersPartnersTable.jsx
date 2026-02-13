import { Table, ScrollArea, Text } from "@mantine/core";
import { flexRender } from "@tanstack/react-table";

export function FundersPartnersTable({ table }) {
  return (
    <ScrollArea>
      <Table style={{ tableLayout: "fixed", width: "100%" }}>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>

        <Table.Tbody>
          {table.getRowModel().rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={table.getAllColumns().length}>
                <Text c="dimmed" ta="center" py="md">
                  No results found.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
