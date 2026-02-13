import { Stack, Text, Group, Card, ScrollArea } from "@mantine/core";

export default function SummaryPanel({ rows = [], onClose }) {
  if (!rows.length) return <Text>No projects found.</Text>;

  const projectCount = rows.length;

  const allStaff = rows.flatMap((r) => r.staffDetails || []);
  const uniqueStaffCount = new Set(allStaff.map((s) => s.name)).size;

  const allFunders = rows.flatMap((r) => r.fundersWithCount || []);
  const funderMap = {};
  allFunders.forEach((f) => {
    funderMap[f.name] = (funderMap[f.name] || 0) + f.count;
  });

  const allPartners = rows.flatMap((r) => r.partnersWithCount || []);
  const partnerMap = {};
  allPartners.forEach((p) => {
    partnerMap[p.name] = (partnerMap[p.name] || 0) + p.count;
  });

  return (
    <Stack spacing="md">
      <Text size="lg" weight={600}>
        Summary
      </Text>

      <ScrollArea>
        {/* Top Row: Projects + Staff */}
        <Group spacing="md" align="stretch" wrap="wrap" mb="md">
          <Card shadow="sm" radius="md" p="md" style={{ flex: "1 1 200px", minWidth: 200 }}>
            <Text size="sm" color="dimmed">
              Total Projects
            </Text>
            <Text weight={600} size="lg" mt="xs">
              {projectCount}
            </Text>
          </Card>

          <Card shadow="sm" radius="md" p="md" style={{ flex: "1 1 200px", minWidth: 200 }}>
            <Text size="sm" color="dimmed">
              Unique Staff Contributors
            </Text>
            <Text weight={600} size="lg" mt="xs">
              {uniqueStaffCount}
            </Text>
          </Card>
        </Group>

        {/* Bottom Row: Funders + Partners */}
        <Group spacing="md" align="stretch" wrap="wrap">
          {Object.keys(funderMap).length > 0 && (
            <Card shadow="sm" radius="md" p="md" style={{ flex: "1 1 200px", minWidth: 200 }}>
              <Text size="sm" color="dimmed">
                Funders
              </Text>
              <Stack spacing={2} mt="xs">
                {Object.entries(funderMap).map(([name, count]) => (
                  <Text key={name} size="sm">
                    {name} ({count})
                  </Text>
                ))}
              </Stack>
            </Card>
          )}

          {Object.keys(partnerMap).length > 0 && (
            <Card shadow="sm" radius="md" p="md" style={{ flex: "1 1 200px", minWidth: 200 }}>
              <Text size="sm" color="dimmed">
                Partners
              </Text>
              <Stack spacing={2} mt="xs">
                {Object.entries(partnerMap).map(([name, count]) => (
                  <Text key={name} size="sm">
                    {name} ({count})
                  </Text>
                ))}
              </Stack>
            </Card>
          )}
        </Group>
      </ScrollArea>
    </Stack>
  );
}
