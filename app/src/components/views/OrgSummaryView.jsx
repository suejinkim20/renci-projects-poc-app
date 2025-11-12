import OrgSummary from "../elements/OrgSummary.jsx";
import { getRowsForResearchGroup } from "../../data";

export default function OrgSummaryView() {
  // All active projects
  const rows = getRowsForResearchGroup(null);
// console.log(rows)
  return (
    <div className="space-y-4">
      <OrgSummary rows={rows} />
    </div>
  );
}
