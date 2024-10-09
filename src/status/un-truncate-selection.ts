import { keyBy } from 'lodash-es'
import { Item } from 'src/vote/storeElectionInfo'

import { max_string_length } from '../vote/Ballot'
import { multi_vote_regex } from './tally-votes'

/**
Un-truncate-logic: 
We want a function that takes a decrypted vote selection,

checks if it is the max number of allowed characters (i.e. could have been truncated)

checks the ballot design, looks through the options for that particular question, and checks if any of the options begin with the truncated text.

If there is a match, replace the truncated text with the original selection option.
*/
export function unTruncateSelection(selection: string, ballot_design: Item[], column_key: string): string {
  if (!selection) return selection

  if (selection.length !== max_string_length) return selection

  const ballot_items_by_id = keyBy(ballot_design, 'id')

  // Is this column in a complex format, like item_1, item_2?
  // We'll also check that it's not on the ballot schema, just to be safe
  const multi_suffix = column_key.match(multi_vote_regex)
  if (multi_suffix && !ballot_items_by_id[column_key]) {
    // Use the matched suffix digit to slice off the right length
    column_key = column_key.slice(0, -multi_suffix[0].length)
  }

  const ballot_design_item = ballot_items_by_id[column_key]
  if (!ballot_design_item) return selection

  const truncated_selection = ballot_design_item.options.find((option) => option.name.startsWith(selection))

  return truncated_selection?.name || selection
}
