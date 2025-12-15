import { stripHtml } from "../utils/html.js";
import { normalizeIds } from "../utils/ids.js";

export function normalizeOrganization(raw) {
  if (!raw) return null;
  const acf = raw.acf || {};

  const website = acf.organization_website?.value || acf.organization_website?.value_formatted || "";
  const shortName = acf.organization_short_name?.value || "";
  const longName = raw.title?.rendered || "";

  return {
    id: raw.id,
    slug: raw.slug,
    shortName,
    longName,
    website,
    link: raw.link || "",
    description: stripHtml(raw.excerpt?.rendered || ""),
    relatedFundedProjectIds: normalizeIds(acf.related_funded_projects?.value),
    relatedPartnerProjectIds: normalizeIds(acf.related_partner_projects?.value),
    // these will be populated during graph build
    fundedProjectIds: [],
    partnerProjectIds: []
  };
}
