import { expect, test } from 'bun:test'

import { tallyVotes } from '../tally-votes'

const sampleVotes = {
  ballot_items_by_id: {
    president: {
      id: 'president',
      multiple_votes_allowed: 3,
      options: [{ name: 'George H. W. Bush' }, { name: 'Bill Clinton' }, { name: 'Ross Perot' }],
      title: 'Who should become President?',
      type: 'ranked-choice-irv',
      write_in_allowed: false,
    },
  },
  votes: [
    {
      president_1: 'Bill Clinton',
      president_2: 'George H. W. Bu',
      president_3: 'Ross Perot',
      tracking: '3995-6836-1505',
    },
    {
      president_1: 'Bill Clinton',
      president_2: 'Ross Perot',
      president_3: 'George H. W. Bu',
      tracking: '5225-1927-5026',
    },
    {
      president_1: 'George H. W. Bu',
      president_2: 'Bill Clinton',
      president_3: 'Ross Perot',
      tracking: '5242-3203-2884',
    },
    {
      president_1: 'George H. W. Bu',
      president_2: 'Bill Clinton',
      president_3: 'Ross Perot',
      tracking: '1234-5678-9012',
    },
    {
      president_1: 'Ross Perot',
      president_2: 'Bill Clinton',
      president_3: 'George H. W. Bu',
      tracking: '9876-5432-1098',
    },
  ],
}

const results = tallyVotes(sampleVotes.ballot_items_by_id, sampleVotes.votes)

test("can tally up everyone's top choices as round 1 votes", () => {
  expect(results.president.rounds[0]).toEqual({ 'Bill Clinton': 2, 'George H. W. Bu': 2, 'Ross Perot': 1 })
})
test('can eliminate bottom choice, and recalculate round 2 votes', () => {
  expect(results.president.rounds[1]).toEqual({ 'Bill Clinton': 3, 'George H. W. Bu': 2 })
})
test('can declare a final winner', () => {
  expect(results.president.winner).toEqual('Bill Clinton')
})
