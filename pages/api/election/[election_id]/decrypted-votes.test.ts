import { describe, expect, test } from 'bun:test'
import { Item } from 'src/vote/storeElectionInfo'

import { filterToBallotColumns } from './filterToBallotColumns'

// Reproduces election 1783904907994: a Yes/No ballot that picked up stale
// ranked-choice color columns (vote_1/2/3) from a duplicated ballot design.
const yesNoBallot: Item[] = [
  {
    id: 'vote',
    options: [{ name: 'Yes' }, { name: 'No' }],
    title: 'Adopt?',
    type: 'choose-only-one',
    write_in_allowed: false,
  },
]

describe('filterToBallotColumns', () => {
  test('drops stray columns not in the ballot design', () => {
    const filtered = filterToBallotColumns(
      [
        { tracking: '1234-5678-9012', vote: 'Yes', vote_1: 'Red', vote_2: 'Blue', vote_3: 'White' },
        { tracking: '4444-3333-2222', vote: 'No' },
      ],
      yesNoBallot,
    )
    expect(filtered).toEqual([
      { tracking: '1234-5678-9012', vote: 'Yes' },
      { tracking: '4444-3333-2222', vote: 'No' },
    ])
  })

  test('keeps legit multi-vote columns (e.g. ranked-choice)', () => {
    const colorBallot: Item[] = [
      {
        id: 'vote',
        multiple_votes_allowed: 3,
        options: [{ name: 'Blue' }, { name: 'Red' }],
        title: 'Best color?',
        type: 'ranked-choice-irv',
        write_in_allowed: false,
      },
    ]
    const votes = [{ tracking: '1', vote_1: 'Blue', vote_2: 'Red', vote_3: 'BLANK' }]
    expect(filterToBallotColumns(votes, colorBallot)).toEqual(votes)
  })

  test('returns votes untouched when ballot design is missing', () => {
    const votes = [{ tracking: '1', vote: 'Yes', vote_1: 'Red' }]
    expect(filterToBallotColumns(votes, undefined)).toEqual(votes)
  })
})
