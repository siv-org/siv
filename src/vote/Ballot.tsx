import { NoSsr } from '@material-ui/core'
import { Dispatch } from 'react'

import { big } from '../crypto/types'
import { Paper } from '../protocol/Paper'
import { Item } from './Item'
import { MultiVoteItem } from './MultiVoteItem'
import { State } from './vote-state'

export const Ballot = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}): JSX.Element => {
  if (!state.ballot_design || !state.public_key) {
    return <p>Loading ballot...</p>
  }

  // Calculate maximum write-in string length
  const max_string_length = Math.floor(big(state.public_key.modulo).bitLength() / 6)

  return (
    <NoSsr>
      <Paper noFade>
        {state.ballot_design.map((item, index) =>
          item.multiple_votes_allowed && item.multiple_votes_allowed > 1 ? (
            <MultiVoteItem {...{ ...item, dispatch, max_string_length, state }} key={index} />
          ) : (
            <Item {...{ ...item, dispatch, max_string_length, state }} key={index} />
          ),
        )}
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
