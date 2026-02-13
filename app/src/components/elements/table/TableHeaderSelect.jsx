import { Stack, Text, Group, UnstyledButton, Select, MultiSelect } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";

export const TableHeaderSelect = ({
  column,
  label,
  options = [],
  multiple = false,
}) => {
  const sortState = column.getIsSorted();

  const value =
    column.getFilterValue() ??
    (multiple ? [] : null);

  const handleChange = (val) => {
    column.setFilterValue(val);
  };

  return (
    <Stack gap={4}>
      <UnstyledButton onClick={column.getToggleSortingHandler()}>
        <Group justify="space-between" align="center" gap="xs">
          <Text size="sm" fw={600}>
            {label}
          </Text>

          {sortState === "asc" && <IconChevronUp size={14} />}
          {sortState === "desc" && <IconChevronDown size={14} />}
        </Group>
      </UnstyledButton>

      {multiple ? (
        <MultiSelect
          size="xs"
          data={options}
          value={value}
          onChange={handleChange}
          searchable
          clearable
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Select
          size="xs"
          data={options}
          value={value}
          onChange={handleChange}
          searchable
          clearable
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </Stack>
  );
};
