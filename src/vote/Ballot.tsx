import { NoSsr } from '@material-ui/core'
import { Dispatch } from 'react'

import { Paper } from '../protocol/Paper'
import { Item } from './Item'
import { useBallotDesign } from './useBallotDesign'
import { State } from './useVoteState'

export const Ballot = ({
  dispatch,
  election_id,
  max_string_length,
  state,
}: {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  max_string_length: number
  state: State
}): JSX.Element => {
  const ballot = useBallotDesign(election_id)

  if (!ballot) {
    return <p>Loading ballot...</p>
  }

  return (
    <NoSsr>
      <Paper noFade>
        {ballot.map((item, index) => (
          <Item {...{ ...item, dispatch, max_string_length, state }} key={index} />
        ))}
      </Paper>
      <style jsx>{`
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10;
          padding: 5px 13px;
          white-space: pre;
        }

        .description,
        .question {
          margin: 13px;
        }
      `}</style>
    </NoSsr>
  )
}
