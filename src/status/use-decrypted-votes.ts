import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'

import { fetcher } from '../api-helper'

type Votes = Record<string, string>[]

export const useDecryptedVotes = (): Votes => {
  const election_id = useRouter().query.election_id as string | undefined
  subscribeToUpdates(election_id)

  const { data } = useSWR(url(election_id), fetcher)

  return data
}

const url = (election_id?: string) =>
  election_id ? `${window.location.origin}/api/election/${election_id}/decrypted-votes` : null

function revalidate(election_id?: string) {
  mutate(url(election_id))
}

function subscribeToUpdates(election_id?: string) {
  function subscribe() {
    if (!election_id) return

    const pusher = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })

    const channel = pusher.subscribe(election_id as string)

    channel.bind(`decrypted`, () => {
      console.log('🆕 Decrypted votes')
      revalidate(election_id)
    })

    // Return cleanup code
    return () => {
      channel.unbind()
    }
  }

  // Subscribe when we get election_id
  useEffect(subscribe, [election_id])
}
