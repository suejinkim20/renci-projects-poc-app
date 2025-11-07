// src/data-build/utils/relationships.js
// resolveOneById and resolveManyById accept either numbers, strings, objects-with-id, arrays, or WP "value" objects

export function resolveOneById(raw, map) {
  if (!raw) return null;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const n = typeof id === "object" && id.id ? id.id : parseInt(id, 10);
  return map && map[n] ? map[n] : null;
}

export function resolveManyById(raw, map) {
  if (!raw) return [];
  let arr = [];
  if (Array.isArray(raw)) arr = raw;
  else if (typeof raw === "object") arr = Object.values(raw);
  else arr = [raw];

  const ids = arr
    .map(x => (typeof x === "object" && x.id ? x.id : parseInt(x, 10)))
    .map(n => (Number.isFinite(n) ? n : null))
    .filter(Boolean);

  // map to objects and dedupe by id
  const seen = new Set();
  const results = [];
  for (const id of ids) {
    if (map && map[id] && !seen.has(id)) {
      results.push(map[id]);
      seen.add(id);
    }
  }
  return results;
}
