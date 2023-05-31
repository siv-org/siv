import { orderBy } from 'lodash-es'

import { mapValues } from '../utils'

export function tallyVotes(ballot_items_by_id: Record<string, unknown>, votes: Record<string, string>[]) {
  const multi_vote_regex = /_\d+$/

  // Sum up votes
  const tallies: Record<string, Record<string, number>> = {}
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
        item = key.slice(0, -(multi_suffix.length + 1))
      }

      // Init item if new
      tallies[item] = tallies[item] || {}

      // Init selection if new
      tallies[item][vote[key]] = tallies[item][vote[key]] || 0

      // Increment by 1
      tallies[item][vote[key]]++
    })
  })
  const totalsCastPerItems: Record<string, number> = {}
  Object.keys(tallies).forEach((item) => {
    totalsCastPerItems[item] = 0
    Object.keys(tallies[item]).forEach((choice) => (totalsCastPerItems[item] += tallies[item][choice]))
  })

  // Sort each item's totals from highest to lowest, with ties sorted alphabetically
  const ordered = mapValues(tallies, (item_totals, item_id) =>
    orderBy(
      orderBy(Object.keys(item_totals as Record<string, number>)),
      (selection) => tallies[item_id][selection],
      'desc',
    ),
  ) as Record<string, string[]>

  // const ordered = {}

  return { ordered, tallies, totalsCastPerItems }
}
