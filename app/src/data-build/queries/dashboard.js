import { shallowMemoize } from "../utils/memoize.js";

/**
 * Returns project objects (normalized) that are active and reference a research group id.
 * graph: the object returned by buildDataGraph()
 */
export const getActiveProjectsByResearchGroup = shallowMemoize((groupId, graph) => {
  if (!groupId) return [];
  return (graph.projects || []).filter(p => {
    return p.active && (p.researchGroupIds || []).includes(Number(groupId));
  });
});

/**
 * Returns enriched rows for the ProjectTable:
 * - project (object)
 * - staffCount
 * - funderNames
 * - partnerNames
 * - otherResearchGroupNames (excluding the selected group)
 * - operationsGroupNames
 */
export const getActiveProjectStatsForResearchGroup = shallowMemoize((groupId, graph) => {
  const projects = getActiveProjectsByResearchGroup(groupId, graph);
  const orgMap = graph._maps.orgsById || {};
  const staffMap = graph._maps.staffById || {};
  const researchMap = graph._maps.researchById || {};
  const opsMap = graph._maps.opsById || {};

  return projects.map(p => {
    // staff ids: union of p.staffIds
    const staffIds = p.staffIds || [];
    // funder names
    const funderNames = (p.fundingOrgIds || []).map(id => orgMap[id]?.longName || orgMap[id]?.shortName).filter(Boolean);
    const partnerNames = (p.partnerOrgIds || []).map(id => orgMap[id]?.longName || orgMap[id]?.shortName).filter(Boolean);

    // other research groups represented by staff:
    const otherResearchGroupIds = new Set();
    for (const sid of staffIds) {
      const s = staffMap[sid];
      if (!s) continue;
      if (s.researchGroupId && Number(s.researchGroupId) !== Number(groupId)) otherResearchGroupIds.add(s.researchGroupId);
    }
    const otherResearchGroupNames = Array.from(otherResearchGroupIds).map(id => researchMap[id]?.title).filter(Boolean);

    // operations groups represented by staff
    const opsIds = new Set();
    for (const sid of staffIds) {
      const s = staffMap[sid];
      if (!s) continue;
      for (const og of s.operationsGroupIds || []) opsIds.add(og);
    }
    const operationsGroupNames = Array.from(opsIds).map(id => opsMap[id]?.title).filter(Boolean);

    return {
      project: p,
      staffCount: staffIds.length,
      funderNames,
      partnerNames,
      otherResearchGroupNames,
      operationsGroupNames
    };
  });
});

/**
 * Returns unique funder organizations (objects) across active projects for a research group.
 */
export const getUniqueFundingOrganizationsForResearchGroup = shallowMemoize((groupId, graph) => {
  const projects = getActiveProjectsByResearchGroup(groupId, graph);
  const orgIds = new Set();
  for (const p of projects) {
    (p.fundingOrgIds || []).forEach(id => orgIds.add(id));
  }
  return Array.from(orgIds).map(id => graph._maps.orgsById[id]).filter(Boolean);
});
