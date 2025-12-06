export type StoredProvisional = {
  election_id: string
  link_auth: string
  stored_at: number
}

const STORAGE_KEY_PREFIX = 'siv_provisional_link_auth_'

export const storeProvisionalLinkAuth = (election_id: string, link_auth: string) => {
  if (typeof window === 'undefined') return
  const value: StoredProvisional = { election_id, link_auth, stored_at: Date.now() }
  window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${election_id}`, JSON.stringify(value))
}

export const getProvisionalLinkAuth = (election_id: string): StoredProvisional | null => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${election_id}`)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredProvisional
    if (parsed && typeof parsed.link_auth === 'string') return parsed
  } catch {
    // ignore parse errors and treat as missing
  }
  return null
}

export const clearProvisionalLinkAuth = (election_id: string) => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${election_id}`)
}


