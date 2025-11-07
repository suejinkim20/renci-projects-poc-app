// src/data-build/utils/ids.js

export function normalizeId(value) {
  if (value === undefined || value === null || value === "") return null;
  // value could be ["123"] or "123" or number
  if (Array.isArray(value)) {
    const v = value[0];
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

export function normalizeIds(value) {
  if (!value) return [];
  // value could be Array, or object with numeric keys (WP sometimes returns object),
  // or falsy.
  let arr = [];
  if (Array.isArray(value)) arr = value;
  else if (typeof value === "object") arr = Object.values(value);
  else arr = [value];

  return arr
    .map(v => {
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : null;
    })
    .filter(Boolean);
}
