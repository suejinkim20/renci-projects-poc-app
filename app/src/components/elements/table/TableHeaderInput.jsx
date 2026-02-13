import { Stack, Text, TextInput, Group, UnstyledButton } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";

export const TableHeaderInput = ({
  column,
  label,
  type = "text",
  placeholder,
}) => {
  const sortState = column.getIsSorted();

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

      <TextInput
        size="xs"
        type={type}
        value={column.getFilterValue() ?? ""}
        onChange={(e) =>
          column.setFilterValue(
            type === "number"
              ? e.target.value === ""
                ? ""
                : Number(e.target.value)
              : e.target.value
          )
        }
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()}
      />
    </Stack>
  );
};
