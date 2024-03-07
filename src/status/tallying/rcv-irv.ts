import { mapValues, omit } from 'src/utils'
import { Item } from 'src/vote/storeElectionInfo'

import { tallyVotes } from '../tally-votes'

export type IRV_Round = {
  ordered: string[]
  tallies: Record<string, number>
  totalVotes: number
}

export const tally_IRV_Items = (
  IRV_columns_seen: Record<string, boolean>,
  ballot_items_by_id: Record<string, Item>,
  votes: Record<string, string>[],
) => {
  // First we undo the multi-vote suffixes to get back to the ballot_design ids
  const items: Record<string, { rounds: IRV_Round[] }> = {}
  Object.keys(IRV_columns_seen).forEach((key) => {
    const item = key.slice(0, -2)
    items[item] = { rounds: [] }
  })

  // Then for each voting item....
  Object.keys(items).forEach((item) => {
    // The IRV algorithm is to go round-by-round,
    const round_num = 1

    // give 1 vote for each voter's highest choice not yet eliminated...
    const highest_choices = votes.map((vote) => {
      const this_rounds_vote: { [key: string]: string } = { tracking: vote.tracking }
      this_rounds_vote[item] = vote[`${item}_${round_num}`]
      return this_rounds_vote
    })

    // Now we can call our normal tallying function on this, to get the round total:
    const round_result = mapValues(
      omit(tallyVotes(ballot_items_by_id, highest_choices), ['irv']), // remove empty irv subsection
      (subsection) => (subsection as Record<string, unknown>)[item], // remove unnecessary item-id redundancy
    ) as IRV_Round
    console.log('\nround', round_num, 'result:', round_result)

    items[item].rounds.push(round_result)
  })

  return items
}
