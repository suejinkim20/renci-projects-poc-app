// strip HTML and normalize whitespace
// src/data-build/utils/html.js
export function stripHtml(input = "") {
  if (!input) return "";
  // quick, safe HTML stripper
  return String(input).replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ").trim();
}

