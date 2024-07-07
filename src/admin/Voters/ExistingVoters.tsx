import { useEffect, useReducer, useState } from 'react'

import { useStored } from '../useStored'
import { InvalidVotersTable } from './InvalidVotersTable'
import { NumVotedRow } from './NumVotedRow'
import { PendingVotesTable } from './PendingVotesTable'
import { getStatus } from './Signature'
import { TopBarButtons } from './TopBarButtons'
import { UnlockedStatus } from './UnlockedStatus'
import { ValidVotersTable } from './ValidVotersTable'

export const ExistingVoters = () => {
  const { esignature_requested, valid_voters, voters } = useStored()
  const [checked, set_checked] = useState<boolean[]>(new Array(valid_voters?.length).fill(false))
  const num_voted = valid_voters?.filter((v) => v.has_voted).length || 0
  const num_approved = !esignature_requested
    ? num_voted
    : valid_voters?.filter(({ esignature_review }) => getStatus(esignature_review) === 'approve').length || 0

  const [hide_voted, toggle_hide_voted] = useReducer((state) => !state, false)
  const [hide_approved, toggle_hide_approved] = useReducer((state) => !state, false)

  // Grow checked array to match voters list
  useEffect(() => {
    if (valid_voters && checked.length !== valid_voters.length) {
      const new_checked = [...checked]
      new_checked.length = valid_voters.length
      set_checked(new_checked)
    }
  }, [valid_voters?.length])

  // Don't show anything if we don't have any voters yet
  if (!voters?.length) return null

  return (
    <>
      {/* Group around Accepted Voters table */}
      <div className="pt-3 pb-1 pl-4 -ml-4 rounded shadow-md bg-blue-200/40">
        <UnlockedStatus />
        <div className="pr-4">
          <TopBarButtons {...{ checked, num_approved, num_voted }} />
        </div>

        <NumVotedRow
          {...{ hide_approved, hide_voted, num_approved, num_voted, toggle_hide_approved, toggle_hide_voted }}
        />

        <ValidVotersTable {...{ checked, hide_approved, hide_voted, num_voted, set_checked }} />
      </div>

      <PendingVotesTable />

      <InvalidVotersTable {...{ checked, hide_approved, hide_voted, set_checked }} />
    </>
  )
}
