import {
  getPopularServiceIdsFromEnv,
  MAX_POPULAR_SERVICES,
  POPULAR_SERVICE_MATCHERS,
} from "../config/bookingServices";

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0);
}

function normalizeComparableText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function getQueryVariants(rawQuery) {
  const base = normalizeComparableText(rawQuery);
  if (!base) return [];

  const variants = new Set([
    base,
    base.replace(/\s+/g, "-"),
    base.replace(/\s+/g, ""),
    base.replace(/-/g, " "),
  ]);

  return [...variants].filter(Boolean);
}

function commonPrefixLength(a, b) {
  const limit = Math.min(a.length, b.length);
  let index = 0;
  while (index < limit && a[index] === b[index]) {
    index += 1;
  }
  return index;
}

function fuzzyTokenMatch(queryToken, candidateToken) {
  if (!queryToken || !candidateToken) return false;
  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) {
    return true;
  }

  if (queryToken.length < 2) {
    return candidateToken.startsWith(queryToken);
  }

  const requiredPrefixLength = Math.min(3, queryToken.length);
  if (commonPrefixLength(queryToken, candidateToken) < requiredPrefixLength) {
    return false;
  }

  const lengthGap = Math.abs(queryToken.length - candidateToken.length);
  if (lengthGap > 3) return false;

  const distance = levenshtein(queryToken, candidateToken);
  const maxLength = Math.max(queryToken.length, candidateToken.length);
  const similarity = 1 - distance / maxLength;

  if (similarity >= 0.5) return true;

  const maxDistance =
    queryToken.length <= 4 ? 2 : Math.max(2, Math.floor(queryToken.length * 0.4));

  return distance <= maxDistance;
}

function textMatchesQueryVariants(text, rawQuery) {
  const normalizedText = normalizeComparableText(text);
  if (!normalizedText) return false;

  return getQueryVariants(rawQuery).some((variant) => {
    const normalizedVariant = normalizeComparableText(variant);
    return normalizedVariant && normalizedText.includes(normalizedVariant);
  });
}

function tokensMatchQueryTokens(haystackTokens, queryTokens) {
  return queryTokens.every((queryToken) =>
    haystackTokens.some((haystackToken) => fuzzyTokenMatch(queryToken, haystackToken))
  );
}

export function serviceMatchesQuery(service, rawQuery) {
  const query = String(rawQuery || "").trim();
  if (!query) return true;

  const fields = [service?.name, service?.description].filter(Boolean);
  if (fields.length === 0) return false;

  if (fields.some((field) => textMatchesQueryVariants(field, query))) {
    return true;
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return false;

  const nameTokens = tokenize(service?.name);
  if (nameTokens.length > 0 && tokensMatchQueryTokens(nameTokens, queryTokens)) {
    return true;
  }

  const haystackTokens = fields.flatMap((field) => tokenize(field));
  if (haystackTokens.length === 0) return false;

  return tokensMatchQueryTokens(haystackTokens, queryTokens);
}

export function filterServices(services, rawQuery) {
  const list = Array.isArray(services) ? services : [];
  const query = String(rawQuery || "").trim();
  if (!query) return list;
  return list.filter((service) => serviceMatchesQuery(service, query));
}

export function buildPopularServiceIds(services) {
  const ids = new Set(getPopularServiceIdsFromEnv());

  for (const service of Array.isArray(services) ? services : []) {
    if (ids.size >= MAX_POPULAR_SERVICES) break;
    if (ids.has(service.id)) continue;
    if (POPULAR_SERVICE_MATCHERS.some((matcher) => matcher(service.name || ""))) {
      ids.add(service.id);
    }
  }

  return ids;
}

export function isPopularService(service, popularIds) {
  return Boolean(service?.id && popularIds?.has(service.id));
}

export function getServiceMatchScore(service, rawQuery, popularIds) {
  const query = String(rawQuery || "").trim();
  if (!query) return 0;
  if (!serviceMatchesQuery(service, query)) return 0;

  const name = normalizeComparableText(service?.name);
  const queryNormalized = normalizeComparableText(query);
  const queryTokens = tokenize(query);
  const nameTokens = tokenize(service?.name);

  let score = 10;

  if (name === queryNormalized) score = 100;
  else if (textMatchesQueryVariants(service?.name, query)) score = 90;
  else if (nameTokens.length > 0 && tokensMatchQueryTokens(nameTokens, queryTokens)) score = 80;
  else if (textMatchesQueryVariants(service?.description, query)) score = 55;
  else score = 40;

  if (isPopularService(service, popularIds)) score += 8;

  return score;
}

export function sortServicesByRelevance(services, rawQuery, popularIds) {
  const query = String(rawQuery || "").trim();
  const list = Array.isArray(services) ? services : [];

  if (!query) {
    const popular = [];
    const rest = [];

    for (const service of list) {
      if (isPopularService(service, popularIds)) popular.push(service);
      else rest.push(service);
    }

    return [...popular, ...rest];
  }

  return [...list]
    .map((service) => ({
      service,
      score: getServiceMatchScore(service, query, popularIds),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.service.name.localeCompare(b.service.name))
    .map((entry) => entry.service);
}

export function partitionServicesForDisplay(services, rawQuery, popularIds) {
  const query = String(rawQuery || "").trim();
  const list = Array.isArray(services) ? services : [];

  if (!query) {
    const popular = list.filter((service) => isPopularService(service, popularIds));
    const rest = list.filter((service) => !isPopularService(service, popularIds));
    return {
      mode: "browse",
      popular,
      rest,
      matches: list,
      matchCount: list.length,
    };
  }

  const matches = sortServicesByRelevance(filterServices(list, query), query, popularIds);

  return {
    mode: "search",
    popular: matches.filter((service) => isPopularService(service, popularIds)),
    rest: matches.filter((service) => !isPopularService(service, popularIds)),
    matches,
    matchCount: matches.length,
  };
}

/**
 * Split service name into segments for highlighting the active search query.
 */
export function getHighlightedNameSegments(name, rawQuery) {
  const text = String(name || "");
  const query = String(rawQuery || "").trim();
  if (!text || !query) return [{ text, highlight: false }];

  const variants = getQueryVariants(query).sort((a, b) => b.length - a.length);
  const lowerName = text.toLowerCase();

  for (const variant of variants) {
    const lowerVariant = variant.toLowerCase();
    const index = lowerName.indexOf(lowerVariant);
    if (index === -1) continue;

    const segments = [];
    if (index > 0) segments.push({ text: text.slice(0, index), highlight: false });
    segments.push({
      text: text.slice(index, index + variant.length),
      highlight: true,
    });
    const after = index + variant.length;
    if (after < text.length) {
      segments.push({ text: text.slice(after), highlight: false });
    }
    return segments;
  }

  return [{ text, highlight: false }];
}
