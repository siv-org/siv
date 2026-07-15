/** Elections that may use MissingAuthInfoBanner / lookup-link-auth (temporary Jul 2026). */
export const LINK_AUTH_RECOVERY_ELECTIONS = new Set(['1783637746011', '1783994820958']) // CCN + test

export type LookupResult = { link_auth: string; needs_auth: boolean }

export type MissingAuthDecision =
  | { action: 'cta'; link_auth: string }
  | { action: 'error'; message: string }
  | { action: 'fetch'; body: { encrypted_vote: Record<string, unknown> } | { link_auth: string } }
  | { action: 'mark_complete'; link_auth: string }
  | { action: 'skip' }

type DecideInput = {
  auth: string
  auth_added_at?: string
  election_id: string
  /** Ciphertext from local vote state; used when link_auth is unknown */
  encrypted?: Record<string, unknown>
  knownLinkAuth: null | string
  /** Omit while deciding whether to fetch; pass result afterward */
  lookup?: { kind: 'http' | 'network'; ok: false } | { ok: true; result: LookupResult }
}

/**
 * Pure cohort logic for MissingAuthInfoBanner.
 * Call once without `lookup` to get `fetch` | `skip`, then again with the API result.
 */
export function decideMissingAuth({
  auth,
  auth_added_at,
  election_id,
  encrypted,
  knownLinkAuth,
  lookup,
}: DecideInput): MissingAuthDecision {
  if (auth !== 'link' || auth_added_at) return { action: 'skip' }
  if (!LINK_AUTH_RECOVERY_ELECTIONS.has(election_id)) return { action: 'skip' }

  const hasEncrypted = !!encrypted && Object.keys(encrypted).length > 0

  // Still need a server round-trip
  if (!lookup) {
    if (knownLinkAuth) return { action: 'fetch', body: { link_auth: knownLinkAuth } }
    if (hasEncrypted) return { action: 'fetch', body: { encrypted_vote: encrypted } }
    return { action: 'skip' }
  }

  if (!lookup.ok) {
    // Only show errors when we were trying ciphertext recovery (no stored link_auth)
    if (knownLinkAuth) return { action: 'skip' }
    return {
      action: 'error',
      message:
        lookup.kind === 'network'
          ? 'Error getting your registration info. Please contact help@siv.org for assistance.'
          : 'Error recovering your registration link. Please contact help@siv.org for assistance.',
    }
  }

  const { link_auth, needs_auth } = lookup.result
  if (!needs_auth) return { action: 'mark_complete', link_auth }
  return { action: 'cta', link_auth }
}
