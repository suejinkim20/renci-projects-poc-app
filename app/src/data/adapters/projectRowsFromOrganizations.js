export function buildOrganizationRows(organizations = []) {
  return organizations.map((org) => {
    const projects = [];
    const researchGroupSet = new Set();

    const collectProject = (project) => {
      projects.push({
        id: project.post_id,
        title: project.name,
        slug: project.slug,
        staffDetails:
          project.contributors?.map((c) => {
            const groups = c.research_groups?.map((rg) => rg.name) || [];
            groups.forEach((g) => researchGroupSet.add(g));

            return {
              name: c.name,
              slug: c.slug,
              researchGroupName: groups.join(", ") || null,
            };
          }) || [],
      });

      project.research_groups?.forEach((rg) =>
        researchGroupSet.add(rg.name)
      );
    };

    org.funded_projects?.forEach(collectProject);
    org.partner_projects?.forEach(collectProject);

    const isFunder = !!org.funded_projects?.length;
    const isPartner = !!org.partner_projects?.length;

    let relationship = "Neither";
    if (isFunder && isPartner) relationship = "Both";
    else if (isFunder) relationship = "Funder";
    else if (isPartner) relationship = "Partner";

    return {
      name: org.name,
      slug: org.slug,
      url: org.website,
      projects,
      researchGroups: Array.from(researchGroupSet),
      isFunder,
      isPartner,
      relationship,
    };
  });
}
