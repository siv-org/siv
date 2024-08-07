import { orderBy } from 'lodash-es'
import { Item } from 'src/vote/storeElectionInfo'

import { mapValues } from '../utils'
import { tally_IRV_Items } from './tallying/rcv-irv'

type SafeRecord<V> = Partial<Record<string, V>>

export function tallyVotes(
  ballot_items_by_id: Partial<Record<string, Item>>,
  votes: Partial<Record<string, string>>[],
) {
  const multi_vote_regex = /_(\d+)$/

  // Sum up votes
  const tallies: SafeRecord<SafeRecord<number>> = {}
  const IRV_columns_seen: SafeRecord<boolean> = {}
  votes.forEach((vote) => {
    Object.keys(vote).forEach((key) => {
      // Skip 'tracking' key
      if (key === 'tracking') return

      let item = key

      // Is this item the multiple_votes_allowed format?
      const multi_suffix = key.match(multi_vote_regex)
      // We'll also check that it's not on the ballot schema, just to be safe
      if (multi_suffix && !ballot_items_by_id[key]) {
        // If so, we need to add all tallies to seed id, not the derived keys
        // Use the matched suffix digit to slice off the right length
        item = key.slice(0, -multi_suffix[0].length)

        // RCV-IRV items use a different tallying algorithm, so we skip them for now
        if (ballot_items_by_id[item]?.type === 'ranked-choice-irv') return (IRV_columns_seen[key] = true)
      }

      // Init item if new
      tallies[item] = tallies[item] || {}

      // Init selection if new
      tallies[item][vote[key]] = tallies[item][vote[key]] || 0

      // Increment by 1
      tallies[item][vote[key]]++
    })
  })

  // Calc total votes cast per item, to speed up calc'ing %s
  const totalsCastPerItems: SafeRecord<number> = {}
  Object.keys(tallies).forEach((item) => {
    totalsCastPerItems[item] = 0
    Object.keys(tallies[item]).forEach((choice) => (totalsCastPerItems[item] += tallies[item][choice]))
  })

  // Sort each item's totals from highest to lowest, with ties sorted alphabetically
  const ordered = mapValues(tallies, (item_totals, item_id) =>
    orderBy(
      orderBy(Object.keys(item_totals as SafeRecord<number>)),
      (selection) => tallies[item_id][selection],
      'desc',
    ),
  ) as SafeRecord<string[]>

  // Go back and IRV tally any of those that we skipped
  const irv = tally_IRV_Items(IRV_columns_seen, ballot_items_by_id, votes)

  return { irv, ordered, tallies, totalsCastPerItems }
}
