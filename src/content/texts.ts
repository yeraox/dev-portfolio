/** Every text of a dictionary with its path, e.g. ['stats.rows.0.label', 'Especialidad'].
 *  Used by the tests (both languages have the same shape) and the /dev/textos review page. */
export function flattenTexts(value: unknown, path = ''): [string, string][] {
  // TS concept — `unknown` + checks: TypeScript only lets us use `value` as a string, an array or
  // an object after each `typeof` / `Array.isArray` check has proved it.
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => flattenTexts(item, `${path}.${i}`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => flattenTexts(item, path ? `${path}.${key}` : key));
  }
  return [];
}
