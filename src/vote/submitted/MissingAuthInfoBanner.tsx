import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

import { State } from '../vote-state'

type LookupResult = { link_auth: string; needs_auth: boolean }

/** Elections that may use MissingAuthInfoBanner / lookup-link-auth (temporary Jul 2026). */
export const LINK_AUTH_RECOVERY_ELECTIONS = new Set(['1783637746011', '1783994820958']) // CCN + test

export function MissingAuthInfoBanner({
  auth,
  election_id,
  state,
}: {
  auth: string
  election_id: string
  state: State & { submitted_at: Date }
}) {
  const router = useRouter()
  const link_auth_query = router.query.link_auth
  const [linkAuth, setLinkAuth] = useState<null | string>(null)
  const [showCta, setShowCta] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (auth !== 'link' || state.auth_added_at) return
    if (!LINK_AUTH_RECOVERY_ELECTIONS.has(election_id)) return

    const knownLinkAuth = (typeof link_auth_query === 'string' && link_auth_query) || state.link_auth || null

    let cancelled = false
    setChecking(true)
    setError('')
    ;(async () => {
      try {
        const body = knownLinkAuth ? { link_auth: knownLinkAuth } : { encrypted_vote: state.encrypted }

        // No ciphertext and no link_auth — can't resolve
        if (!knownLinkAuth && (!state.encrypted || !Object.keys(state.encrypted).length)) {
          if (!cancelled) setChecking(false)
          return
        }

        const response = await api(`election/${election_id}/lookup-link-auth`, body)
        if (cancelled) return

        if (!response.ok) {
          setChecking(false)
          // Only surface an error if we expected to recover (no stored link_auth)
          if (!knownLinkAuth)
            setError('Error recovering your registration link. Please contact help@siv.org for assistance.')
          return
        }

        const result: LookupResult = await response.json()
        patchVoteLocalStorage(election_id, { link_auth: result.link_auth })

        if (!result.needs_auth) {
          patchVoteLocalStorage(election_id, { auth_added_at: new Date().toISOString() })
          setShowCta(false)
          setChecking(false)
          return
        }

        setLinkAuth(result.link_auth)
        setShowCta(true)
        setChecking(false)
      } catch {
        if (!cancelled) {
          setChecking(false)
          if (!knownLinkAuth)
            setError('Error getting your registration info. Please contact help@siv.org for assistance.')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [auth, election_id, link_auth_query, state.auth_added_at, state.encrypted, state.link_auth])

  if (!LINK_AUTH_RECOVERY_ELECTIONS.has(election_id)) return null
  if (auth !== 'link' || state.auth_added_at || checking) return null
  if (!showCta && !error) return null

  return (
    <div className="block p-4 mb-10 text-center bg-amber-50 rounded border-2 border-amber-400 border-dashed">
      {error ? (
        <p className="m-0 text-sm">{error}</p>
      ) : (
        <>
          <h3 className="m-0 text-lg">Your Voter Authentication Info is still missing</h3>
          <p className="mt-2 mb-3 text-sm">Please finish so your vote can be counted.</p>
          <a
            className="inline-block px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded cursor-pointer hover:no-underline hover:bg-cyan-700"
            href={`/election/${election_id}/auth?link=${linkAuth}`}
          >
            Complete Voter Authentication
          </a>
        </>
      )}
    </div>
  )
}

function patchVoteLocalStorage(election_id: string, patch: Record<string, string>) {
  try {
    const voteKey = `voter-${election_id}-link`
    const voteState = JSON.parse(localStorage.getItem(voteKey) || '{}')
    localStorage.setItem(voteKey, JSON.stringify({ ...voteState, ...patch }))
  } catch {
    console.error('Error patching vote local storage', election_id, patch)
  }
}
