import { flatten } from 'lodash-es'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { CipherStrings } from 'src/crypto/stringify-shuffle'
import { pusher } from 'src/pusher-helper'
import useSWR from 'swr'

import { Item } from '../vote/storeElectionInfo'

export type EncryptedVote = { auth: string } & { [index: string]: CipherStrings }
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const InvalidatedVotes = ({
  ballot_design,
  title_prefix = '',
}: {
  ballot_design?: Item[]
  esignature_requested?: boolean
  has_decrypted_votes?: boolean
  title_prefix?: string
}): JSX.Element => {
  const { election_id } = useRouter().query

  const { data: votes, mutate } = useSWR<EncryptedVote[]>(
    !election_id ? null : `/api/election/${election_id}/invalidated-votes`,
    fetcher,
  )

  // Subscribe to pusher updates of new votes
  subscribeToUpdates(mutate, election_id)

  if (!votes || !ballot_design) return <div>Loading...</div>

  const columns = flatten(
    ballot_design.map(({ id, multiple_votes_allowed }) => {
      return multiple_votes_allowed
        ? new Array(multiple_votes_allowed).fill('').map((_, index) => `${id || 'vote'}_${index + 1}`)
        : id || 'vote'
    }),
  )

  return (
    <section>
      <h3>{title_prefix}Invalidated Votes</h3>
      <p>These votes were invalidated by the election administrator.</p>
      <table>
        <thead>
          <tr>
            <th>Auth Token</th>
            <th>Encrypted Vote</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote, index) => (
            <tr key={index}>
              <td>{vote.auth}</td>
              <td>{JSON.stringify(vote.encrypted_vote)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export const stringifyEncryptedVote = (vote: EncryptedVote) =>
  `{ auth: ${vote.auth}${Object.keys(vote)
    .map((key) =>
      key === 'auth' ? '' : `, ${key}: { encrypted: '${vote[key].encrypted}', lock: '${vote[key].lock}' }`,
    )
    .join('')} }`

function subscribeToUpdates(loadVotes: () => void, election_id?: string | string[]) {
  function subscribe() {
    if (!pusher) return alert('Pusher not initialized')

    const channel = pusher.subscribe(`status-${election_id}`)

    channel.bind(`votes`, () => {
      console.log('🆕 Pusher new invalidated vote')
      loadVotes()
    })

    // Return cleanup code
    return () => {
      channel.unbind()
    }
  }

  // Subscribe when we get election_id
  useEffect(() => {
    if (election_id) {
      return subscribe()
    }
  }, [election_id])
}
