import { useState, useMemo } from "react";
import {
  researchGroups,
  getRowsForResearchGroup,
} from "../data";

export function useDashboardData(initialResearchGroupId = null) {
  // Initialize selected research group
  const [selectedResearchGroupId, setSelectedResearchGroupId] = useState(
    initialResearchGroupId || (researchGroups[0]?.id ?? null)
  );

  // Compute rows for the currently selected research group
  const rows = useMemo(() => {
    if (!selectedResearchGroupId) return [];
    return getRowsForResearchGroup(selectedResearchGroupId);
  }, [selectedResearchGroupId]);

  // Expose research groups for dropdown and setter
  return {
    researchGroups, // array of {id, title, ...} for dropdown
    selectedResearchGroupId,
    setSelectedResearchGroupId,
    rows, // enriched project rows
  };
}
