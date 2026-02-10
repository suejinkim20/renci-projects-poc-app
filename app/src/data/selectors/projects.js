export function getResearchGroupsFromProjects(projects = []) {
  const map = new Map();

  projects.forEach((project) => {
    project.research_groups?.forEach((rg) => {
      map.set(rg.post_id, {
        id: rg.post_id,
        title: rg.name,
      });
    });
  });

  return Array.from(map.values());
}

export function getAllResearchGroupsFromRows(rows = []) {
  const set = new Set();

  rows.forEach((project) => {
    project.staffDetails?.forEach((s) => {
      if (s.researchGroupName) set.add(s.researchGroupName);
    });
  });

  return Array.from(set).sort();
}
