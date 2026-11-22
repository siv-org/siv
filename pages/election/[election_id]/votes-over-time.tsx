import { firebase } from 'api/_services'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import type { VoteTimeBucket } from '../../api/election/[election_id]/votes-over-time'

import { Head } from '../../../src/Head'
import { VotesOverTime } from '../../../src/status/VotesOverTime'
import { TailwindPreflight } from '../../../src/TailwindPreflight'

type VotesOverTimeResponse = {
  buckets: VoteTimeBucket[]
  election_title: null | string
  totals: { accepted: number; pending: number }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/** Unlisted for now — not linked from status yet. */
export default function VotesOverTimePage({ election_title }: { election_title?: null | string }) {
  const { election_id } = useRouter().query as { election_id?: string }
  const { data, error } = useSWR<VotesOverTimeResponse>(
    election_id ? `/api/election/${election_id}/votes-over-time` : null,
    fetcher,
  )
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  const title = data?.election_title ?? election_title
  const totalVotes = data ? data.totals.accepted + data.totals.pending : undefined

  return (
    <>
      <Head dropPrefix title={title ? `Votes over time: ${title}` : 'Votes over time'} />
      <main className="px-4 py-10 min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <h1 className="mt-0 mb-1 text-3xl font-bold text-slate-900">Votes over time</h1>
          {title && <h2 className="mt-0 mb-1 text-xl font-medium text-slate-700">{title}</h2>}
          {election_id && (
            <p className="mt-0 text-sm text-slate-500">
              Election ID: <b>{election_id}</b>
              {totalVotes != null && (
                <>
                  {' '}
                  · {totalVotes} vote{totalVotes === 1 ? '' : 's'}
                </>
              )}
            </p>
          )}

          {!ready || (!data && !error) ? (
            <p className="mt-10 text-slate-500">Loading…</p>
          ) : error || !data ? (
            <p className="mt-10 text-red-600">Failed to load vote times.</p>
          ) : (
            <VotesOverTime buckets={data.buckets} />
          )}
        </div>
      </main>
      <TailwindPreflight />
    </>
  )
}

// ponytail: only the title for OG/iMessage previews; vote times still load client-side
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const election_id = params?.election_id as string
  if (!election_id) return { props: {} }

  const data = (await firebase.firestore().collection('elections').doc(election_id).get()).data()
  return { props: { election_title: data?.election_title ?? null } }
}
