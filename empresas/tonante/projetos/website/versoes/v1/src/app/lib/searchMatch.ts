/**
 * Shared text matching for every search surface (navbar suggestions, search
 * modal, v2 search bar and the products page results).
 *
 * Queries are accent-insensitive: "violao" matches "Violão" and vice-versa.
 * A trailing "s" is also tried, so "cordas" matches "corda".
 */

/** Lowercase, strip diacritics and collapse whitespace. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalized query plus its singular form (when it differs). */
export function searchTermVariants(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const singular = normalized.endsWith("s") ? normalized.slice(0, -1) : normalized;
  return singular && singular !== normalized ? [normalized, singular] : [normalized];
}

/** True when `text` contains any of the query variants. */
export function matchesSearchTerm(text: string | undefined | null, terms: string[]): boolean {
  if (!text || terms.length === 0) return false;
  const haystack = normalizeSearchText(text);
  return terms.some((term) => haystack.includes(term));
}

/** True when any of the fields contains the query. Accepts the raw query. */
export function matchesSearchQuery(fields: (string | undefined | null)[], query: string): boolean {
  const terms = searchTermVariants(query);
  if (terms.length === 0) return false;
  return fields.some((field) => matchesSearchTerm(field, terms));
}
