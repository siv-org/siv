import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from 'src/api-helper'

import { useDecryptedVotes } from './use-decrypted-votes'

/** This is an invisible component, that helps to track how well verified a vote is. */
export const AutoVerifier = () => {
  const { election_id } = useRouter().query
  const decryptedVotes = useDecryptedVotes()

  useEffect(() => {
    if (!election_id) return

    // First, look for stored Verification #s for this election
    const storage_keys = Object.keys(localStorage).filter((key) => key.startsWith(`voter-${election_id}`))
    // console.log('AutoVerifier: storage_keys', storage_keys)

    const submittedVotes = storage_keys
      .map((storage_key) => ({ ...JSON.parse(localStorage.getItem(storage_key) || '{}'), storage_key }))
      .filter((record) => record.submitted_at)
    // Stop if none.
    if (!submittedVotes.length) return
    // console.log('AutoVerifier: submittedVotes', submittedVotes)

    // Confirm the users' stored Verification Number is present in the election's decrypted votes.
    submittedVotes.forEach((vote) => {
      const auth_token = vote.storage_key.split('-')[2]
      if (auth_token === 'link') {
        // Todo: Handle link auth votes
        console.log(vote)
      }

      const expected = vote.tracking

      const verif_found = decryptedVotes.some((v) => v.tracking === expected)

      // console.log('AutoVerifier: verif_found', verif_found, auth_token, expected)

      // Share results with the SIV platform
      // to help create a picture of the state of election verification.
      api(`election/${election_id}/track-auto-verifier`, { auth_token, verif_found })
    })
  }, [election_id])

  return null
}
