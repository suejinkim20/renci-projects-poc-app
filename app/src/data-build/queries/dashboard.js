// src/data-build/queries/dashboard.js
import { shallowMemoize } from "../utils/memoize.js";

/**
 * Single-source row builder for a project.
 * Returns the UI-ready row shape used by ProjectTable and SummaryPanel.
 *
 * Row shape:
 * {
 *   project: { title, slug, link },
 *   staffCount: Number,
 *   staffDetails: [{ name, researchGroupName, operationsGroupNames, affiliation }],
 *   otherResearchGroupNames: [String],
 *   operationsGroups: [String],
 *   fundersWithCount: [{ name, count }],
 *   partnersWithCount: [{ name, count }]
 * }
 */
export function buildRowForProject(p, graph) {
  const orgMap = graph._maps?.orgsById || {};
  const staffMap = graph._maps?.staffById || {};
  const researchMap = graph._maps?.researchById || {};
  const opsMap = graph._maps?.opsById || {};

  const staffIds = p.staffIds || [];

  // Build staffDetails: keep researchGroupName and operationsGroupNames separate.
  // Also compute `affiliation` = researchGroupName || first non-management ops name || ""
  const staffDetails = staffIds
    .map((sid) => {
      const s = staffMap[sid];
      if (!s) return null;

      // name fallbacks (different normalizations might use different fields)
      const name = s.displayName || s.title || s.name || s.acf?.display_name || "";

      const researchGroupName = s.researchGroupId ? researchMap[s.researchGroupId]?.title || null : null;

      // exclude management ops group id 6601
      const operationsGroupNames = (s.operationsGroupIds || [])
        .filter((ogId) => Number(ogId) !== 6601)
        .map((ogId) => opsMap[ogId]?.title)
        .filter(Boolean);

      // primary affiliation: prefer research group, else first non-management ops group name, else blank
      const affiliation = researchGroupName || (operationsGroupNames[0] || "");

      return {
        id: sid,
        name,
        researchGroupName,
        operationsGroupNames,
        affiliation,
      };
    })
    .filter(Boolean);

  // Other research groups (represented by staff on this project) excluding any that match project's own research groups.
  // We want names, deduped.
  const projectResearchGroupIds = new Set((p.researchGroupIds || []).map((id) => Number(id)));
  const otherResearchGroupIds = new Set();
  for (const sd of staffDetails) {
    if (sd.researchGroupName) {
      // find the research id by matching title -> id (reverse lookup using researchMap)
      // but we can also check staff's researchGroupId if present in staffMap (safer)
      const s = staffMap[sd.id];
      const rgId = s?.researchGroupId ? Number(s.researchGroupId) : null;
      if (rgId && !projectResearchGroupIds.has(rgId)) otherResearchGroupIds.add(rgId);
    }
  }
  const otherResearchGroupNames = Array.from(otherResearchGroupIds)
    .map((id) => researchMap[id]?.title)
    .filter(Boolean);

  // Operations groups represented across staff (deduped), excluding management id 6601
  const opsIds = new Set();
  for (const sd of staffDetails) {
    (sd.operationsGroupNames || []).forEach((name) => {
      // opsMap values are names; we have them already. We'll collect names directly.
      opsIds.add(name);
    });
  }
  const operationsGroups = Array.from(opsIds);

  // Funder & partner counts per project (these are counts at project-level; for summary aggregation we'll sum across rows)
  const funderCountMap = {};
  (p.fundingOrgIds || []).forEach((id) => {
    funderCountMap[id] = (funderCountMap[id] || 0) + 1;
  });
  const partnerCountMap = {};
  (p.partnerOrgIds || []).forEach((id) => {
    partnerCountMap[id] = (partnerCountMap[id] || 0) + 1;
  });

  const fundersWithCount = Object.entries(funderCountMap)
    .map(([id, count]) => {
      const org = orgMap[id];
      if (!org) return null;
      return {
        name: org.longName || org.shortName,
        count,
        url: org.link || org.website || org.url || null, // support multiple possible fields
      };
    })
    .filter(Boolean);

  const partnersWithCount = Object.entries(partnerCountMap)
    .map(([id, count]) => {
      const org = orgMap[id];
      if (!org) return null;
      return {
        name: org.longName || org.shortName,
        count,
        url: org.link || org.website || org.url || null,
      };
    })
    .filter(Boolean);

  return {
    id: p.id,
    title: (p.title && (p.title.rendered || p.title)) || p.name || "",
    staffDetails,
    fundersWithCount,
    partnersWithCount,
  };
}

/**
 * Returns project objects (normalized) that are active and reference a research group id.
 * graph: the object returned by buildDataGraph()
 */
export const getActiveProjectsByResearchGroup = shallowMemoize((groupId, graph) => {
  if (!groupId) return [];
  return (graph.projects || []).filter((p) => {
    return p.active && (p.researchGroupIds || []).map(Number).includes(Number(groupId));
  });
});

/**
 * Returns enriched rows for the ProjectTable and SummaryPanel for a given research group.
 * Delegates to buildRowForProject for row shape.
 */
export function getActiveProjectStatsForResearchGroup(researchGroupId, graph) {
  const projects = graph.projects.filter((p) => {
    return p.active && (researchGroupId ? (p.researchGroupIds || []).map(Number).includes(Number(researchGroupId)) : true);
  });

  return projects.map((p) => buildRowForProject(p, graph));
}


/**
 * Returns enriched rows for ALL active projects (org-wide).
 */
export const getAllActiveProjectStats = shallowMemoize((graph) => {
  const projects = (graph.projects || []).filter((p) => p.active);
  return projects.map((p) => buildRowForProject(p, graph));
});

/**
 * Convenience export names (optional) - ensure your index/data file imports the correct names.
 */
export default {
  buildRowForProject,
  getActiveProjectsByResearchGroup,
  getActiveProjectStatsForResearchGroup,
  getAllActiveProjectStats,
};
