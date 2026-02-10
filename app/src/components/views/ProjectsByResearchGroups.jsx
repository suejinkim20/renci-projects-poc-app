import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";

import ProjectTable from "../elements/ProjectTable";
import SummaryPanel from "../elements/SummaryPanel";
import Modal from "../elements/Modal";

import { RESEARCH_GROUPS_QUERY } from "../../lib/graphql/queries";
import { buildProjectRowsFromResearchGroup } from "../../data/adapters/projectRowsFromResearchGroups";

export default function ProjectsByResearchGroups() {
  const [selectedIndex, setSelectedIndex] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const { data, loading, error } = useQuery(RESEARCH_GROUPS_QUERY);
  const researchGroups = data?.research_groups ?? [];

  const selectedGroup =
    selectedIndex !== "" ? researchGroups[selectedIndex] : null;

  const rows = useMemo(
    () => (selectedGroup ? buildProjectRowsFromResearchGroup(selectedGroup) : []),
    [selectedGroup]
  );

  if (loading) return <p>Loading research groups…</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Projects by Research Group</h2>

      <select
        value={selectedIndex}
        onChange={(e) => setSelectedIndex(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">Select a Research Group</option>
        {researchGroups.map((rg, idx) => (
          <option key={rg.name} value={idx}>{rg.name}</option>
        ))}
      </select>

      {selectedGroup && (
        <>
          <button
            onClick={() => setShowSummary(true)}
            className="border rounded px-3 py-1 text-sm"
          >
            View Summary
          </button>

          <ProjectTable rows={rows} />
        </>
      )}

      {showSummary && (
        <Modal onClose={() => setShowSummary(false)}>
          <SummaryPanel
            rows={rows}
            onClose={() => setShowSummary(false)}
          />
        </Modal>
      )}
    </div>
  );
}
