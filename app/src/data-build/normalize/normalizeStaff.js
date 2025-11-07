import { stripHtml } from "../utils/html.js";
import { normalizeId, normalizeIds } from "../utils/ids.js";

export function normalizeStaff(raw) {
  if (!raw) return null;
  const acf = raw.acf || {};

  const name = acf.display_name?.value || raw.title?.rendered || "";
  const sortingName = acf.sorting_name?.value || "";
  const jobTitle = acf["renci-job-title"]?.value || "";
  const biography = stripHtml(acf.biography?.value || "");
  const chiefScientist = acf.chief_scientist?.value === "1" || acf.chief_scientist?.value === true;

  return {
    id: raw.id,
    slug: raw.slug,
    name,
    sortingName,
    jobTitle,
    biography,
    chiefScientist,
    chiefScientistBio: acf.chief_scientist_bio?.value || "",
    link: raw.link || "",

    // relationships
    researchGroupId: normalizeId(acf.research_group?.value),
    operationsGroupIds: normalizeIds(acf.operations_group?.value),
    projectIds: normalizeIds(acf.projects?.value),
    relatedPosts: normalizeIds(acf.related_posts?.value),
    relatedEvents: normalizeIds(acf.related_events?.value)
  };
}
