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

  // Close misspellings and partial words (e.g. "true" -> "truing").
  if (similarity >= 0.5) return true;

  const maxDistance =
    queryToken.length <= 4 ? 2 : Math.max(2, Math.floor(queryToken.length * 0.4));

  return distance <= maxDistance;
}

export function serviceMatchesQuery(service, rawQuery) {
  const query = String(rawQuery || "").trim().toLowerCase();
  if (!query) return true;

  const fields = [service?.name, service?.description].filter(Boolean);
  if (fields.length === 0) return false;

  const haystackText = fields.join(" ").toLowerCase();
  if (haystackText.includes(query)) return true;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return false;

  const haystackTokens = fields.flatMap((field) => tokenize(field));
  if (haystackTokens.length === 0) return false;

  return queryTokens.every((queryToken) =>
    haystackTokens.some((haystackToken) => fuzzyTokenMatch(queryToken, haystackToken))
  );
}

export function filterServices(services, rawQuery) {
  const list = Array.isArray(services) ? services : [];
  const query = String(rawQuery || "").trim();
  if (!query) return list;
  return list.filter((service) => serviceMatchesQuery(service, query));
}
