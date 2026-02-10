// src/data/adapters/projectRows.js

export function buildProjectRows(projects = [], { researchGroupId } = {}) {
  if (!researchGroupId) return [];

  return projects
    .filter((project) =>
      Array.isArray(project.research_groups) &&
      project.research_groups.some(
        (rg) => String(rg.post_id) === String(researchGroupId)
      )
    )
    .map((project) => ({
      id: project.post_id,
      slug: project.slug,
      name: project.name,

      // used by SummaryPanel
      staffDetails: Array.isArray(project.contributors)
        ? project.contributors.map((c) => ({
            id: c.post_id,
            name: c.name,
          }))
        : [],

      // placeholders until orgs are added
      fundersWithCount: [],
      partnersWithCount: [],
    }));
}
