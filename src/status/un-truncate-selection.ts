import { Item } from 'src/vote/storeElectionInfo'

import { max_string_length } from '../vote/Ballot'

/**
Un-truncate-logic: 
We want a function that takes a decrypted vote selection,

checks if it is the max number of allowed characters (i.e. could have been truncated)

checks the ballot design, looks through the options for that particular question, and checks if any of the options begin with the truncated text.

If there is a match, replace the truncated text with the original selection option.
*/
export function unTruncateSelection(selection: string, ballot_design: Item[], column_key: string): string {
  if (selection.length !== max_string_length) return selection

  const ballot_design_item = ballot_design.find((item) => item.id === column_key)
  if (!ballot_design_item) return selection

  const truncated_selection = ballot_design_item.options.find((option) => option.name.startsWith(selection))

  return truncated_selection?.name || selection
}
