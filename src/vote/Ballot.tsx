import { NoSsr } from '@material-ui/core'
import { Dispatch } from 'react'
import { maxLength } from 'src/crypto/curve'

import { Paper } from '../protocol/Paper'
import { Item } from './Item'
import { MultiVoteItem } from './MultiVoteItem'
import { RankedChoiceItem } from './RankedChoiceItem'
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
  if (!state.ballot_design) return <p>Loading ballot...</p>
  if (!state.public_key) return <p>This ballot is not ready for votes yet</p>

  return (
    <NoSsr>
      <Paper noFade>
        <>
          {/* Election Title */}
          {state.election_title && <h2 className="ml-[13px]">{state.election_title}</h2>}

          {state.ballot_design.map((item, index) => {
            const max_options = item.options.length + +item.write_in_allowed

            // Is it "Approval" ?
            if (item.type === 'approval')
              return (
                <MultiVoteItem {...{ ...item, dispatch, multiple_votes_allowed: max_options, state }} key={index} />
              )

            // Is it "Choose-up-to" ?
            if (
              item.type === 'multiple-votes-allowed' &&
              item.multiple_votes_allowed &&
              item.multiple_votes_allowed > 1
            )
              return (
                <MultiVoteItem
                  {...{
                    ...item,
                    dispatch,
                    multiple_votes_allowed: Math.min(item.multiple_votes_allowed, max_options),
                    state,
                  }}
                  key={index}
                />
              )

            // Is it "Ranked Choice"?
            if (item.type === 'ranked-choice-irv')
              return (
                <RankedChoiceItem
                  {...{
                    ...item,
                    dispatch,
                    state,
                  }}
                  key={index}
                />
              )

            // Otherwise, load default "Choose-only-one"
            return <Item {...{ ...item, dispatch, state }} key={index} />
          })}
        </>
      </Paper>
    </NoSsr>
  )
}
