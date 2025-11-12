import { useState } from "react";
import ProjectTable from "../elements/ProjectTable";
import {
  researchGroups,
  getRowsForResearchGroup,
} from "../../data";
import SummaryPanel from "../elements/SummaryPanel";

export default function DashboardView() {
  const [selectedResearchGroup, setSelectedResearchGroup] = useState("");

  // rows for the currently selected research group
  const rows = selectedResearchGroup
    ? getRowsForResearchGroup(Number(selectedResearchGroup))
    : getRowsForResearchGroup(null); // null returns all projects

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
          <option value="">All Research Groups</option>
          {researchGroups.map((rg) => (
            <option key={rg.id} value={rg.id} style={{fontSize: "1rem"}} >
                {rg.title}
            </option>
          ))}
        </select>
      </div>
      <SummaryPanel rows={rows} />
      <ProjectTable rows={rows} />
    </div>
  );
}
