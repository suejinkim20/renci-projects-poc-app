// src/data-build/buildDataGraph.js
import { normalizeResearchGroup } from "./normalize/normalizeResearchGroup.js";
import { normalizeOperationsGroup } from "./normalize/normalizeOperationsGroup.js";
import { normalizeStaff } from "./normalize/normalizeStaff.js";
import { normalizeOrganization } from "./normalize/normalizeOrganization.js";
import { normalizeProject } from "./normalize/normalizeProject.js";

import { createMapById, createMapBySlug } from "./utils/maps.js";
import { normalizeIds } from "./utils/ids.js";

export function buildDataGraph({ rawProjects = [], rawStaff = [], rawOrgs = [], rawResearchGroups = [], rawOperationsGroups = [] }) {
  // 1. normalize collections
  const projects = rawProjects.map(normalizeProject);
  const staff = rawStaff.map(normalizeStaff);
  const organizations = rawOrgs.map(normalizeOrganization);
  const researchGroups = rawResearchGroups.map(normalizeResearchGroup);
  const operationsGroups = rawOperationsGroups.map(normalizeOperationsGroup);

  // 2. create maps by id and slug
  const projectsById = createMapById(projects);
  const staffById = createMapById(staff);
  const orgsById = createMapById(organizations);
  const researchById = createMapById(researchGroups);
  const opsById = createMapById(operationsGroups);

  const projectsBySlug = createMapBySlug(projects);
  const researchBySlug = createMapBySlug(researchGroups);
  const opsBySlug = createMapBySlug(operationsGroups);
  const orgsBySlug = createMapBySlug(organizations);
  const staffBySlug = createMapBySlug(staff);

  // 3. hydrate direct project.staffIds from contributors if present
  for (const p of projects) {
    if (p.contributorIds && p.contributorIds.length) {
      p.staffIds = Array.from(new Set([...(p.contributorIds || []), ...(p.staffIds || [])]));
    } else {
      p.staffIds = p.staffIds || [];
    }
  }

  // 4. populate reverse relationships:
  // staff -> projects (already in staff.projectIds), but ensure project.staffIds includes them
  for (const s of staff) {
    // research group - push staff into researchGroup.staffIds
    if (s.researchGroupId) {
      const rg = researchById[s.researchGroupId];
      if (rg) rg.teamMembers = Array.from(new Set([...(rg.teamMembers || []), s.id]));
    }

    // ops groups
    for (const gid of s.operationsGroups || []) {
      const og = opsById[gid];
      if (og) og.staffIds = Array.from(new Set([...(og.staffIds || []), s.id]));
    }

    // staff.projects -> push staff into project.staffIds
    for (const pid of s.projectIds || []) {
      const proj = projectsById[pid];
      if (proj) proj.staffIds = Array.from(new Set([...(proj.staffIds || []), s.id]));
    }
  }

  // 5. projects -> ops & research group reverse mapping
  for (const p of projects) {
    // research groups
    for (const rgid of p.researchGroupIds || []) {
      const rg = researchById[rgid];
      if (rg) rg.projectIds = Array.from(new Set([...(rg.projectIds || []), p.id]));
    }

    // operations groups
    for (const ogid of p.operationsGroupIds || []) {
      const og = opsById[ogid];
      if (og) og.projectIds = Array.from(new Set([...(og.projectIds || []), p.id]));
    }

    // organizations: populate org.fundedProjectIds / partnerProjectIds
    for (const fid of p.fundingOrgIds || []) {
      const org = orgsById[fid];
      if (org) org.fundedProjectIds = Array.from(new Set([...(org.fundedProjectIds || []), p.id]));
    }
    for (const pid of p.partnerOrgIds || []) {
      const org = orgsById[pid];
      if (org) org.partnerProjectIds = Array.from(new Set([...(org.partnerProjectIds || []), p.id]));
    }
  }

  // 6. ensure researchGroups.teamMembers and projects arrays exist
  for (const rg of researchGroups) {
    rg.teamMembers = Array.from(new Set(rg.teamMembers || []));
    rg.projectIds = Array.from(new Set(rg.projectIds || []));
  }
  for (const og of operationsGroups) {
    og.staffIds = Array.from(new Set(og.staffIds || []));
    og.projectIds = Array.from(new Set(og.projectIds || []));
  }
  for (const org of organizations) {
    org.fundedProjectIds = Array.from(new Set(org.fundedProjectIds || []));
    org.partnerProjectIds = Array.from(new Set(org.partnerProjectIds || []));
  }

  // 7. final graph
  const graph = {
    projects,
    staff,
    organizations,
    researchGroups,
    operationsGroups,

    // maps
    _maps: {
      projectsById,
      staffById,
      orgsById,
      researchById,
      opsById,
      projectsBySlug,
      researchBySlug,
      opsBySlug,
      orgsBySlug,
      staffBySlug
    }
  };

  return graph;
}
