export function buildProjectRowsFromResearchGroup(researchGroup) {
  if (!researchGroup || !Array.isArray(researchGroup.projects)) return [];

  return researchGroup.projects.map((project) => ({
    title: project.name,
    slug: project.slug,
    active: project.active,

    staffDetails: project.contributors?.map((c) => ({
      name: c.name,
      url: c.slug,
    })) ?? [],

    fundersWithCount: project.funding_organizations?.map((o) => ({
      name: o.name,
      count: 1,
    })) ?? [],

    partnersWithCount: project.partner_organizations?.map((o) => ({
      name: o.name,
      count: 1,
    })) ?? [],
  }));
}
