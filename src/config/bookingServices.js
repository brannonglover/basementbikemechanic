/**
 * Quick-pick chips on /book — searchQuery is passed to service search/ranking.
 * Order is display order on mobile (wraps on larger screens).
 */
export const SERVICE_QUICK_PICKS = [
  { id: "tune-up", label: "Tune-up", searchQuery: "tune-up" },
  { id: "brakes", label: "Brakes", searchQuery: "brake" },
  { id: "flat-tire", label: "Flat / tire", searchQuery: "tire replacement" },
  { id: "wheels", label: "Wheels", searchQuery: "wheel truing" },
  { id: "ebike", label: "E-bike", searchQuery: "ebike" },
];

/** Name matchers for "Common requests" (first N matches in API list order). */
export const POPULAR_SERVICE_MATCHERS = [
  (name) => /^standard tune-up$/i.test(name.trim()),
  (name) => /^wheel cleaning\/truing/i.test(name),
  (name) =>
    /^tube and\/or tire replacement \(per tire\)$/i.test(name.trim()) &&
    !/ebike/i.test(name),
  (name) =>
    /^brake pad cleaning and bedding \(per brake\)$/i.test(name.trim()) &&
    !/ebike/i.test(name),
  (name) => /^deep clean tune-up$/i.test(name.trim()),
  (name) => /^standard tune-up ebike$/i.test(name.trim()),
];

export const MAX_POPULAR_SERVICES = 6;

/** Optional comma-separated BikeOps service IDs (REACT_APP_POPULAR_SERVICE_IDS). */
export function getPopularServiceIdsFromEnv() {
  const raw = process.env.REACT_APP_POPULAR_SERVICE_IDS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}
