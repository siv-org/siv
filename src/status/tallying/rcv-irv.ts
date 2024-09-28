import { isNotUndefined, mapKeys, mapValues, omit } from 'src/utils'
import { defaultRankingsAllowed } from 'src/vote/Ballot'
import { Item } from 'src/vote/storeElectionInfo'

import { multi_vote_regex, tallyVotes } from '../tally-votes'

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
  const items: Record<string, { rounds: IRV_Round[]; winners: string[] }> = {}
  Object.keys(IRV_columns_seen).forEach((key) => {
    const multi_suffix = key.match(multi_vote_regex)
    if (!multi_suffix) throw new Error(`Unexpected key ${key} breaking multi-vote regex`)
    const item = key.slice(0, -multi_suffix[0].length)
    items[item] = { rounds: [], winners: [] }
  })

  // Then for each voting item....
  Object.keys(items).forEach((item) => {
    const eliminated: string[] = []

    // Get question parameters
    const max_selections = ballot_items_by_id[item].multiple_votes_allowed || defaultRankingsAllowed
    const { number_of_winners = 1 } = ballot_items_by_id[item]

    // The IRV algorithm is to go round-by-round,
    const MAX_ROUNDS = 30 // arbitrary to prevent endless loops
    for (let round_num = 1; round_num < MAX_ROUNDS; round_num++) {
      // give 1 vote for each voter's highest choice not yet eliminated...
      const highest_choices = votes.map((vote) => {
        for (let choice_num = 1; choice_num <= max_selections; choice_num++) {
          const choice = vote[`${item}_${choice_num}`]

          // If this choice hasn't been eliminated, we're good!
          if (choice && !eliminated.includes(choice) && choice !== 'BLANK') {
            return { [item]: choice }
          }
        }
      })

      // Remove blanks
      const highest_valid_choices = highest_choices.filter(isNotUndefined)

      // Now we can call our normal tallying function on this, to get the round total:
      const round_result = mapKeys(
        mapValues(
          omit(tallyVotes(ballot_items_by_id, highest_valid_choices), ['irv']), // remove empty irv subsection
          (subsection) => (subsection as Record<string, unknown>)[item], // remove unnecessary item-id redundancy
        ),
        (val, key) => (key === 'totalsCastPerItems' ? 'totalVotes' : key),
      ) as IRV_Round
      //   console.log('\nround', round_num, 'result:', round_result)
      //   console.log('eliminated:', eliminated)

      items[item].rounds.push(round_result)

      // Did anyone exceed the winning threshold?
      let foundAWinner = false
      const threshold_to_win = round_result.totalVotes / (number_of_winners + 1) // 50% for single-winner

      for (const candidate of round_result.ordered) {
        if (round_result.tallies[candidate] > threshold_to_win) {
          // Yes! Found a winner
          items[item].winners.push(candidate)

          // Done once enough winners are found
          if (items[item].winners.length === number_of_winners) return

          // Remove winner from future rounds
          eliminated.push(candidate)
          foundAWinner = true
        }
      }

      // Otherwise, eliminate the lowest choice and restart the loop
      const last = round_result.ordered.at(-1)
      if (!last) return // shouldn't happen
      if (!foundAWinner) eliminated.push(last)
    }
  })

  return items
}
