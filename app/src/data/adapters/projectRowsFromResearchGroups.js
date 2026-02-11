export function buildProjectRowsFromResearchGroup(researchGroup) {
  if (!researchGroup || !Array.isArray(researchGroup.projects)) return [];

  return researchGroup.projects.map((project) => ({
    title: project.name,
    slug: project.slug,
    active: project.active,

    staffDetails: project.contributors?.map((c) => ({
      name: c.name,
      slug: c.slug,
      id: c.post_id,
      affiliation: c.research_groups?.find((g) => g.post_id === researchGroup.post_id)
        ? `internal` 
        : c.research_groups?.map((g) => g.name).join(", ") || c.operations_groups?.map((g) => g.name).join(", ") || "",
    })) ?? [],

    fundersWithCount: project.funding_organizations?.map((o) => ({
      name: o.name,
      count: 1,
      id: o.post_id,
      slug: o.slug,
    })) ?? [],

    partnersWithCount: project.partner_organizations?.map((o) => ({
      name: o.name,
      count: 1,
      id: o.post_id,
      slug: o.slug,
    })) ?? [],
  }));
}
