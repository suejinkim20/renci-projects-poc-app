import { stripHtml } from "../utils/html.js";
import { normalizeId, normalizeIds } from "../utils/ids.js";

export function normalizeProject(raw) {
  if (!raw) return null;
  const acf = raw.acf || {};

  const title = raw.title?.rendered || "";
  const link = raw.link || raw.guid?.rendered || "";
  const active = acf.active?.value === "1" || acf.active?.value === true || acf.active?.value_formatted === true;
  const description = acf.description?.value || acf.description?.value_formatted || raw.excerpt?.rendered || "";

  // contributors may be stored as IDs array
  const contributorIds = normalizeIds(acf.contributors?.value);

  // funding and partners ACF fields appear to return objects (return_format: object)
  // but WP output also contains arrays/ids; we normalize to IDs
  const fundingIds = normalizeIds(acf.funding_organizations?.value);
  const partnerIds = normalizeIds(acf.partner_organizations?.value);

  // research_group / operations_group: may be id arrays or single value
  const researchGroupIds = normalizeIds(acf.research_group?.value);
  const operationsGroupIds = normalizeIds(acf.operations_group?.value);

  // urls repeater: normalize if present
  const urls =
    acf.urls?.value && Array.isArray(acf.urls.value)
      ? acf.urls.value.map(r => r.field_689cf4a0ca6b3 || r.link_url || r.link_url?.value).filter(Boolean)
      : [];

  return {
    id: raw.id,
    slug: raw.slug,
    title,
    link,
    active: !!active,
    status: raw.status || (active ? "publish" : "draft"),
    description: stripHtml(description),
    contributorIds,
    fundingOrgIds: fundingIds,
    partnerOrgIds: partnerIds,
    researchGroupIds,
    operationsGroupIds,
    urls,
    staffIds: [], // populated during graph build from contributors or reverse staff.projectIds
  };
}
