// src/data-build/utils/maps.js

export function createMapById(items = []) {
  return items.reduce((acc, it) => {
    if (it && it.id !== undefined) acc[it.id] = it;
    return acc;
  }, {});
}

export function createMapBySlug(items = []) {
  return items.reduce((acc, it) => {
    if (it && it.slug) acc[it.slug] = it;
    return acc;
  }, {});
}
