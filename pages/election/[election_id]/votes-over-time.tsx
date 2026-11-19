import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Head } from '../../../src/Head'
import { VotesOverTime } from '../../../src/status/VotesOverTime'
import { TailwindPreflight } from '../../../src/TailwindPreflight'

type VotesOverTimeResponse = {
  election_title: null | string
  submitted_at: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/** Unlisted demo page — not linked from status yet. */
export default function VotesOverTimePage() {
  const { election_id } = useRouter().query as { election_id?: string }
  const { data, error } = useSWR<VotesOverTimeResponse>(
    election_id ? `/api/election/${election_id}/votes-over-time` : null,
    fetcher,
  )
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  return (
    <>
      <Head dropPrefix title={data?.election_title ? `Votes over time: ${data.election_title}` : 'Votes over time'} />
      <main className="min-h-screen px-4 py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="mt-0 mb-1 text-3xl font-bold text-slate-900">Votes over time</h1>
          {data?.election_title && (
            <h2 className="mt-0 mb-1 text-xl font-medium text-slate-700">{data.election_title}</h2>
          )}
          {election_id && (
            <p className="mt-0 text-sm text-slate-500">
              Election ID: <b>{election_id}</b>
              {data?.submitted_at && (
                <>
                  {' '}
                  · {data.submitted_at.length} vote{data.submitted_at.length === 1 ? '' : 's'}
                </>
              )}
            </p>
          )}

          {!ready || (!data && !error) ? (
            <p className="mt-10 text-slate-500">Loading…</p>
          ) : error || !data ? (
            <p className="mt-10 text-red-600">Failed to load vote times.</p>
          ) : (
            <VotesOverTime submitted_at={data.submitted_at} />
          )}
        </div>
      </main>
      <TailwindPreflight />
    </>
  )
}
