import ViewAllPartnersFunders from "../elements/ViewAllPartnersFunders.jsx";
import { getRowsForResearchGroup } from "../../data/index.js";

export default function PartnersFundersView() {
  // All active projects
  const rows = getRowsForResearchGroup(null);
// console.log(rows)
  return (
    <div className="space-y-4">
      <ViewAllPartnersFunders rows={rows} />
    </div>
  );
}
