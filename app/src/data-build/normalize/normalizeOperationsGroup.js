import { stripHtml } from "../utils/html.js";

export function normalizeOperationsGroup(raw) {
  if (!raw) return null;
  const excerpt = raw.excerpt?.rendered || "";
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered || "",
    link: raw.link || "",
    description: stripHtml(excerpt),
    staffIds: [],    // populated during graph build
    projectIds: []   // populated during graph build
  };
}
