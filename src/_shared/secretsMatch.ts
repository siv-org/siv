/** Fail closed: Raw `undefined === undefined`, so a missing stored token can "match" without additional check. Missing or blank secrets should always return false. */
export function secretsMatch(stored: unknown, provided: unknown) {
  if (typeof stored !== 'string' || !stored) return false
  if (typeof provided !== 'string' || !provided) return false
  return stored === provided
}
