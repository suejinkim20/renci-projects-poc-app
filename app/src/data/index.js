import rawProjects from "./projects/index.json";
import rawStaff from "./staff/index.json";
import rawOrgs from "./organizations/index.json";
import rawResearch from "./research_groups/index.json";
import rawOps from "./operations_groups/index.json";

import { buildDataGraph } from "../data-build/buildDataGraph.js";
import {
  getActiveProjectStatsForResearchGroup,
  getAllActiveProjectStats
} from "../data-build/queries/dashboard.js";

// Build the data graph once
export const graph = buildDataGraph({
  rawProjects,
  rawStaff,
  rawOrgs,
  rawResearchGroups: rawResearch,
  rawOperationsGroups: rawOps,
});

// Convenience exports
export const projects = graph.projects;
export const staff = graph.staff;
export const researchGroups = graph.researchGroups;
export const operationsGroups = graph.operationsGroups;

// Function to get project rows for a given research group
export function getRowsForResearchGroup(researchGroupId) {
  if (!researchGroupId) {
    return getAllActiveProjectStats(graph);
  }
  return getActiveProjectStatsForResearchGroup(Number(researchGroupId), graph);
}
