import { NoSsr } from '@material-ui/core'
import { Dispatch } from 'react'
import { maxLength } from 'src/crypto/curve'

import { Paper } from '../protocol/Paper'
import { Item } from './Item'
import { MultiVoteItem } from './MultiVoteItem'
import { State } from './vote-state'

// Calculate maximum write-in string length
const verification_num_length = 15
export const max_string_length = maxLength - verification_num_length

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

  return (
    <NoSsr>
      <Paper noFade>
        <>
          {state.election_title && <h2>{state.election_title}</h2>}
          {state.ballot_design.map((item, index) =>
            item.multiple_votes_allowed && item.multiple_votes_allowed > 1 ? (
              <MultiVoteItem
                {...{
                  ...item,
                  dispatch,
                  multiple_votes_allowed: item.multiple_votes_allowed,
                  state,
                }}
                key={index}
              />
            ) : (
              <Item {...{ ...item, dispatch, state }} key={index} />
            ),
          )}
        </>
      </Paper>
      <style jsx>{`
        h2 {
          margin-left: 13px;
        }
      `}</style>
    </NoSsr>
  )
}
