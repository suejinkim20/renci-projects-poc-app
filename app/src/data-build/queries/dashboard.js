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
 * Returns enriched rows for the ProjectTable and SummaryPanel:
 * Each row contains:
 * - project (object)
 * - staffCount
 * - fundersWithCount [{name, count}]
 * - partnersWithCount [{name, count}]
 * - otherResearchGroupNames (excluding selected group)
 * - operationsGroupNames
 * - staffDetails [{name, researchGroupName, operationsGroupNames}]
 */
export const getActiveProjectStatsForResearchGroup = shallowMemoize((groupId, graph) => {
  const projects = (graph.projects || []).filter(
    p => p.active && (p.researchGroupIds || []).includes(Number(groupId))
  );

  const orgMap = graph._maps.orgsById || {};
  const staffMap = graph._maps.staffById || {};
  const researchMap = graph._maps.researchById || {};
  const opsMap = graph._maps.opsById || {};

  return projects.map(p => {
    const staffIds = p.staffIds || [];

    // Staff details
const staffDetails = staffIds.map(sid => {
  const s = staffMap[sid];
  if (!s) return null;

  // research group name (null if none)
  const researchGroupName = s.researchGroupId ? researchMap[s.researchGroupId]?.title : null;

  // operations groups excluding 6601 (management team)
  const operationsGroupNames = (s.operationsGroupIds || [])
    .filter(ogId => Number(ogId) !== 6601) // exclude management
    .map(ogId => opsMap[ogId]?.title)
    .filter(Boolean);

    return {
      name: s.name,
      researchGroupName,
      operationsGroupNames
    };
  }).filter(Boolean);


    // Other research groups (excluding selected)
    const otherResearchGroupIds = new Set(
      staffDetails
        .map(s => s.researchGroupName)
        .filter(rg => rg && rg !== researchMap[groupId]?.title)
    );

    // Operations groups
    const operationsGroups = Array.from(new Set(staffDetails.flatMap(s => s.operationsGroupNames)));

    // Funder and partner counts
    const funderCountMap = {};
    (p.fundingOrgIds || []).forEach(id => {
      funderCountMap[id] = (funderCountMap[id] || 0) + 1;
    });
    const partnerCountMap = {};
    (p.partnerOrgIds || []).forEach(id => {
      partnerCountMap[id] = (partnerCountMap[id] || 0) + 1;
    });

    const fundersWithCount = Object.entries(funderCountMap)
      .map(([id, count]) => ({ name: orgMap[id]?.longName || orgMap[id]?.shortName, count }))
      .filter(Boolean);

    const partnersWithCount = Object.entries(partnerCountMap)
      .map(([id, count]) => ({ name: orgMap[id]?.longName || orgMap[id]?.shortName, count }))
      .filter(Boolean);

    return {
      project: {
        title: p.title,
        slug: p.slug,
        link: p.link
      },
      staffCount: staffIds.length,
      staffDetails,
      otherResearchGroupNames: Array.from(otherResearchGroupIds),
      operationsGroups,
      fundersWithCount,
      partnersWithCount
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
