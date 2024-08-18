import { flatten } from 'lodash-es'
import { default_multiple_votes_allowed } from 'src/admin/BallotDesign/Wizard'

import { defaultRankingsAllowed } from './Ballot'
import { Item } from './storeElectionInfo'

/** Different ballot types have different rules for expected column names */
export const generateColumnNames = ({ ballot_design }: { ballot_design?: Item[] }) => {
  const for_each_question = ballot_design?.map((question) => {
    const { id = 'vote', options, type, write_in_allowed } = question
    const max_options = options.length + +!!write_in_allowed

    // Question types that allow multiple votes
    if (type === 'multiple-votes-allowed' || type === 'ranked-choice-irv' || type === 'approval') {
      // These allow multiple votes like: president_1, president_2,...
      // But how many? Different logic for each
      let amount = default_multiple_votes_allowed

      if (type === 'multiple-votes-allowed' && question.multiple_votes_allowed)
        amount = Math.min(question.multiple_votes_allowed, max_options)

      if (type === 'ranked-choice-irv')
        amount = question.multiple_votes_allowed || Math.min(defaultRankingsAllowed, max_options)

      if (type === 'approval') amount = max_options

      return new Array(amount).fill('').map((_, index) => `${id}_${index + 1}`)
    }

    // 'Score' & 'budget' expect a vote for each of the question's options
    if (type === 'score' || type === 'budget') return options.map(({ name, value }) => `${id}_${value || name}`)

    // Otherwise we'll just show the question ID, like Just Choose One ("Plurality")
    return id
  })

  // Finally we flatten the possibly two-dimensional arrays into a single one
  return { columns: flatten(for_each_question) }
}
