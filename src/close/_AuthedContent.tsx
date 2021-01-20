import { Trustees } from '../key-generation/1-Trustees'
import { getTrusteesOnInit } from '../key-generation/get-latest-from-server'
import { Dispatch, State, useKeyGenState } from '../key-generation/keygen-state'
import { initPusher } from '../key-generation/pusher-helper'
import { AcceptedVotes } from '../status/AcceptedVotes'
import { useBallotDesign } from '../status/use-ballot-design'
import { ResetButton } from './_ResetButton'
import { VotesToDecrypt } from './VotesToDecrypt'
import { VotesToShuffle } from './VotesToShuffle'

export const AuthedContent = ({
  election_id,
  trustee_auth,
}: {
  election_id: string
  trustee_auth: string
}): JSX.Element => {
  // Initialize local state on client
  const [state, dispatch] = useKeyGenState({ election_id, trustee_auth }) as [State, Dispatch]

  const { private_keyshare } = state

  // Get initial Trustee info
  getTrusteesOnInit({ dispatch, state })

  // Activate Pusher to get updates from the server on new data
  initPusher({ dispatch, state })

  const { ballot_design } = useBallotDesign(election_id)

  if (!private_keyshare) {
    return <p>Error: No `private_keyshare` found in localStorage.</p>
  }

  return (
    <>
      <ResetButton {...{ state }} />

      {/* Trustees */}
      <Trustees {...{ state }} />

      {/* Do we have a private keyshare stored? */}
      <p>Your Private keyshare is: {private_keyshare}</p>

      {/* All Accepted Votes */}
      <AcceptedVotes {...{ ballot_design }} title_prefix="II. " />

      {/* Are there new votes shuffled from the trustee ahead of us that we need to shuffle? */}
      <VotesToShuffle {...{ dispatch, state }} />

      {/* Are there fully shuffled votes we need to partially decrypt? */}
      <VotesToDecrypt {...{ dispatch, state }} />

      <style jsx>{``}</style>
    </>
  )
}
