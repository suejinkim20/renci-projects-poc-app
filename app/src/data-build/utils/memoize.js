// src/data-build/utils/memoize.js
export function shallowMemoize(fn) {
  let lastArgs = null;
  let lastValue = null;
  return function(...args) {
    const key = JSON.stringify(args);
    if (lastArgs === key) return lastValue;
    lastArgs = key;
    lastValue = fn(...args);
    return lastValue;
  };
}
