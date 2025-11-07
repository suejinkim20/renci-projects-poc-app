import { stripHtml } from "../utils/html.js";
import { normalizeIds } from "../utils/ids.js";

export function normalizeResearchGroup(raw) {
  if (!raw) return null;
  const acf = raw.acf || {};
  const description =
    acf.description?.value ||
    acf.description?.value_formatted ||
    raw.excerpt?.rendered ||
    "";
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered || "",
    link: raw.link || "",
    description: stripHtml(description),
    teamMembers: normalizeIds(acf.team_members?.value),
    projectIds: normalizeIds(acf.projects?.value),
    relatedPosts: normalizeIds(acf.related_posts?.value),
    relatedEvents: normalizeIds(acf.related_events?.value)
  };
}
