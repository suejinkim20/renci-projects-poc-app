import { useState } from "react";
import ProjectTable from "../elements/ProjectTable";
import {
  researchGroups,
  getRowsForResearchGroup,
} from "../../data";
import SummaryPanel from "../elements/SummaryPanel";

export default function DashboardView() {
  const [selectedResearchGroup, setSelectedResearchGroup] = useState("");

  // Only build rows if a group is selected
  const rows = selectedResearchGroup
    ? getRowsForResearchGroup(Number(selectedResearchGroup))
    : [];

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold">Projects by Research Group</h2>
      </header>

      <div>
        <label htmlFor="rg-select" className="mr-2 font-medium">
          Filter by Research Group:
        </label>
        <select
          id="rg-select"
          value={selectedResearchGroup}
          onChange={(e) => setSelectedResearchGroup(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Select a Research Group</option>
          {researchGroups.map((rg) => (
            <option key={rg.id} value={rg.id} style={{ fontSize: "1rem" }}>
              {rg.title}
            </option>
          ))}
        </select>
      </div>

      {/* ───────────────────────────────────────────── */}
      {selectedResearchGroup ? (
        <>
          <SummaryPanel rows={rows} />
          <ProjectTable rows={rows} />
        </>
      ) : (
        <div style={{marginTop: "1rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "0.25rem", border: "1px solid #ddd"}}>
          Please select a research group to view data.
        </div>
      )}
    </div>
  );
}
