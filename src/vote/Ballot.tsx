import { memoize } from 'lodash-es'
import { Dispatch } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'
import { maxLength } from 'src/crypto/curve'
import { build_permutation_array } from 'src/crypto/shuffle'

import { Paper } from '../protocol/Paper'
import { BallotPreview } from './BallotPreview'
import { BudgetItem } from './BudgetItem'
import { Item } from './Item'
import { MultiVoteItem } from './MultiVoteItem'
import { RankedChoiceItem } from './RankedChoiceItem'
import { ScoreItem } from './ScoreItem'
import { State } from './vote-state'

// Calculate maximum write-in string length
const verification_num_length = 15
export const max_string_length = maxLength - verification_num_length
export const defaultRankingsAllowed = 3

const memoizedPermutationArray = memoize(build_permutation_array)

export const Ballot = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}): JSX.Element => {
  if (!state.ballot_design) return <p>Loading ballot...</p>

  return (
    <NoSsr>
      <Paper className="!px-4 pt-4" noFade>
        <>
          <BallotPreview {...{ state }} />

          {/* Election Title */}
          {state.election_title && <h2 className="mt-2 sm:ml-[13px]">{state.election_title}</h2>}

          {state.ballot_design.map((item, index) => {
            const max_options = item.options.length + +!!item.write_in_allowed
            let shuffled = item.options
            if (item.randomize_order) {
              const permutationArray = memoizedPermutationArray(item.options.length)
              shuffled = item.options.map((_, index) => item.options[permutationArray[index]])
            }

            // Is it "Approval" ?
            if (item.type === 'approval')
              return (
                <MultiVoteItem
                  {...{ ...item, dispatch, multiple_votes_allowed: max_options, options: shuffled, state }}
                  key={index}
                />
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
                    options: shuffled,
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
                    options: shuffled,
                    rankings_allowed: item.multiple_votes_allowed || Math.min(defaultRankingsAllowed, max_options),
                    state,
                  }}
                  key={index}
                />
              )

            // Is it "Score"?
            if (item.type === 'score')
              return <ScoreItem {...{ ...item, dispatch, options: shuffled, state }} key={index} />

            // Is it "Budget"?
            if (item.type === 'budget')
              return <BudgetItem {...{ ...item, dispatch, options: shuffled, state }} key={index} />

            // Otherwise, load default "Choose-only-one"
            return <Item {...{ ...item, dispatch, options: shuffled, state }} key={index} />
          })}
        </>
      </Paper>
    </NoSsr>
  )
}
