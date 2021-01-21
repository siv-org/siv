import { AcceptedVotes } from '../../status/AcceptedVotes'
import { useBallotDesign } from '../../status/use-ballot-design'
import { Trustees } from '../keygen/1-Trustees'
import { StateAndDispatch } from '../trustee-state'
import { ResetButton } from './_ResetButton'
import { VotesToDecrypt } from './VotesToDecrypt'
import { VotesToShuffle } from './VotesToShuffle'

export const ShuffleAndDecrypt = ({
  dispatch,
  election_id,
  state,
}: StateAndDispatch & { election_id: string }): JSX.Element => {
  const { private_keyshare } = state
  const { ballot_design } = useBallotDesign(election_id)

  if (!private_keyshare) {
    return <p>Error: No `private_keyshare` found in localStorage.</p>
  }

  return (
    <>
      <h2>Anonymizing &amp; Unlocking Votes</h2>

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
