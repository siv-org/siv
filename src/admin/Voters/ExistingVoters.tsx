import { useEffect, useReducer, useState } from 'react'

import { useStored } from '../useStored'
import { NumVotedRow } from './NumVotedRow'
import { getStatus } from './Signature'
import { TopBarButtons } from './TopBarButtons'
import { use_latest_mailgun_events } from './use-latest-mailgun-events'
import { ValidVotersTable } from './ValidVotersTables'

export const ExistingVoters = () => {
  const { election_id, esignature_requested, voters } = useStored()
  const [checked, set_checked] = useState<boolean[]>(new Array(voters?.length).fill(false))
  const num_voted = voters?.filter((v) => v.has_voted).length || 0
  const num_approved = !esignature_requested
    ? num_voted
    : voters?.filter(({ esignature_review }) => getStatus(esignature_review) === 'approve').length || 0

  const [hide_voted, toggle_hide_voted] = useReducer((state) => !state, false)
  const [hide_approved, toggle_hide_approved] = useReducer((state) => !state, false)

  use_latest_mailgun_events(election_id, voters)

  // Grow checked array to match voters list
  useEffect(() => {
    if (voters && checked.length !== voters.length) {
      const new_checked = [...checked]
      new_checked.length = voters.length
      set_checked(new_checked)
    }
  }, [voters?.length])

  // Don't show anything if we don't have any voters yet
  if (!voters?.length) return null

  return (
    <>
      <TopBarButtons {...{ checked, num_approved, num_voted }} />

      <NumVotedRow
        {...{ hide_approved, hide_voted, num_approved, num_voted, toggle_hide_approved, toggle_hide_voted }}
      />

      <ValidVotersTable {...{ checked, hide_approved, hide_voted, num_voted, set_checked }} />
    </>
  )
}
