import { useState } from 'react'

import { AcceptedVotes } from '../../status/AcceptedVotes'
import { useElectionInfo } from '../../status/use-election-info'
import { Trustees } from '../keygen/1-Trustees'
import { PrivateBox } from '../PrivateBox'
import { StateAndDispatch } from '../trustee-state'
import { ResetButton } from './_ResetButton'
import { VotesToDecrypt } from './VotesToDecrypt'
import { VotesToShuffle } from './VotesToShuffle'

export const ShuffleAndDecrypt = ({ dispatch, state }: StateAndDispatch): JSX.Element => {
  const { private_keyshare } = state
  const { ballot_design } = useElectionInfo()
  const [final_shuffle_verifies, set_final_shuffle_verifies] = useState(false)

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
      <br />
      <PrivateBox>
        <p>Your Private keyshare is: {private_keyshare}</p>
      </PrivateBox>

      {/* All Accepted Votes */}
      <AcceptedVotes {...{ ballot_design }} title_prefix="II. " />

      {/* Are there new votes shuffled from the trustee ahead of us that we need to shuffle? */}
      <VotesToShuffle {...{ dispatch, final_shuffle_verifies, set_final_shuffle_verifies, state }} />

      {/* Are there fully shuffled votes we need to partially decrypt? */}
      <VotesToDecrypt {...{ dispatch, final_shuffle_verifies, state }} />

      <style jsx>{``}</style>
    </>
  )
}
