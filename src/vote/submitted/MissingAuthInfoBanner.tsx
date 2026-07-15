import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

import { State } from '../vote-state'
import { decideMissingAuth, LINK_AUTH_RECOVERY_ELECTIONS, type MissingAuthDecision } from './decideMissingAuth'

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
  const [outcome, setOutcome] = useState<MissingAuthDecision>({ action: 'skip' })
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const knownLinkAuth = (typeof link_auth_query === 'string' && link_auth_query) || state.link_auth || null
    const base = {
      auth,
      auth_added_at: state.auth_added_at,
      election_id,
      encrypted: state.encrypted as Record<string, unknown> | undefined,
      knownLinkAuth,
    }

    const first = decideMissingAuth(base)
    if (first.action !== 'fetch') {
      setOutcome(first)
      setChecking(false)
      return
    }

    let cancelled = false
    setChecking(true)
    setOutcome({ action: 'skip' })
    ;(async () => {
      try {
        const response = await api(`election/${election_id}/lookup-link-auth`, first.body)
        if (cancelled) return

        if (!response.ok) {
          setOutcome(decideMissingAuth({ ...base, lookup: { kind: 'http', ok: false } }))
          setChecking(false)
          return
        }

        const result = await response.json()
        const decided = decideMissingAuth({ ...base, lookup: { ok: true, result } })
        if (decided.action === 'cta' || decided.action === 'mark_complete')
          patchVoteLocalStorage(election_id, { link_auth: decided.link_auth })
        if (decided.action === 'mark_complete')
          patchVoteLocalStorage(election_id, { auth_added_at: new Date().toISOString() })

        setOutcome(decided)
        setChecking(false)
      } catch {
        if (cancelled) return
        setOutcome(decideMissingAuth({ ...base, lookup: { kind: 'network', ok: false } }))
        setChecking(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [auth, election_id, link_auth_query, state.auth_added_at, state.encrypted, state.link_auth])

  if (!LINK_AUTH_RECOVERY_ELECTIONS.has(election_id)) return null
  if (checking || outcome.action === 'skip' || outcome.action === 'fetch' || outcome.action === 'mark_complete')
    return null

  return (
    <div className="block p-4 mb-10 text-center bg-amber-50 rounded border-2 border-amber-400 border-dashed">
      {outcome.action === 'error' ? (
        <p className="m-0 text-sm">{outcome.message}</p>
      ) : (
        <>
          <h3 className="m-0 text-lg">Your Voter Authentication Info is still missing</h3>
          <p className="mt-2 mb-3 text-sm">Please finish so your vote can be counted.</p>
          <a
            className="inline-block px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded cursor-pointer hover:no-underline hover:bg-cyan-700"
            href={`/election/${election_id}/auth?link=${outcome.link_auth}`}
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
