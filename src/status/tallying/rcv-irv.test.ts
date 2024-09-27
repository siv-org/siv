import { describe, expect, test } from 'bun:test'

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

describe('IRV tallying', () => {
  test('results now includes an IRV key', () => {
    expect(results).toHaveProperty('irv')
  })
  const { president } = results.irv

  test('IRV items have a "rounds" subarray', () => {
    expect(president).toHaveProperty('rounds')
    expect(Array.isArray(president.rounds)).toBe(true)
  })
  const { rounds } = president

  test("can tally up everyone's top choices as round 1 votes", () => {
    expect(rounds[0].tallies).toEqual({ 'Bill Clinton': 2, 'George H. W. Bu': 2, 'Ross Perot': 1 })
  })

  test('can eliminate bottom choice, and recalculate round 2 votes', () => {
    expect(rounds[1].tallies).toEqual({ 'Bill Clinton': 3, 'George H. W. Bu': 2 })
  })

  test('shows the correct number of rounds', () => {
    expect(rounds).toHaveLength(2)
  })

  test('can declare a single final winner', () => {
    expect(president.winners[0]).toEqual('Bill Clinton')
  })

  test('can handle voters leaving blanks', () => {
    // see https://www.sfchronicle.com/bayarea/article/Alameda-County-admits-tallying-error-in-17682520.php

    // Whether it's left empty (from the unlocking algorithm skipping it)
    const modifiedVotes = [
      ...sampleVotes.votes,
      {
        president_2: 'Bill Clinton',
        president_3: 'Ross Perot',
        tracking: '1111-1111-1111',
      },
    ]
    const resultsWithBlanks = tallyVotes(sampleVotes.ballot_items_by_id, modifiedVotes)
    const { rounds } = resultsWithBlanks.irv.president
    expect(rounds[1].tallies).toEqual({ 'Bill Clinton': 4, 'George H. W. Bu': 2 })

    // Or if it's the explicit codeword "BLANK"
    const modifiedVotes2 = [
      ...sampleVotes.votes,
      {
        president_1: 'BLANK',
        president_2: 'Bill Clinton',
        president_3: 'Ross Perot',
        tracking: '2222-2222-2222',
      },
    ]
    const resultsWithBlanks2 = tallyVotes(sampleVotes.ballot_items_by_id, modifiedVotes2)
    const { rounds: rounds2 } = resultsWithBlanks2.irv.president
    expect(rounds2[1].tallies).toEqual({ 'Bill Clinton': 4, 'George H. W. Bu': 2 })
  })

  test('ok when there are no votes', () => {
    expect(() => tallyVotes(sampleVotes.ballot_items_by_id, [])).not.toThrow()
  })

  test('handles when a ballot runs out of non-eliminated candidates', () => {
    const results2 = tallyVotes(sampleVotes.ballot_items_by_id, [
      ...sampleVotes.votes,
      { president_1: 'BLANK', tracking: '3333-3333-3333' },
    ])
    // Since we only added a blank vote, the results should be the same
    expect(results2.irv.president.rounds[1].tallies).toEqual(results.irv.president.rounds[1].tallies)
  })

  test('handles a ballot w/ both IRV and non-IRV questions', () => {
    const modifiedVotes = sampleVotes.votes.map((vote) => ({
      ...vote,
      another_race: 'banana',
    }))
    const results2 = tallyVotes(sampleVotes.ballot_items_by_id, modifiedVotes)

    expect(results2.irv.president).toEqual(results.irv.president)
    expect(results2.tallies.another_race).toEqual({ banana: 5 })
  })

  test('ok when someone wins in the first round', () => {
    const results2 = tallyVotes(sampleVotes.ballot_items_by_id, [
      ...sampleVotes.votes,
      { president_1: 'Bill Clinton', tracking: '3333-3333-3333' },
      { president_1: 'Bill Clinton', tracking: '4444-4444-4444' },
    ])
    const { rounds, winners } = results2.irv.president
    expect(winners[0]).toEqual('Bill Clinton')
    expect(rounds.length).toEqual(1)
    expect(rounds[0].tallies).toEqual({ 'Bill Clinton': 4, 'George H. W. Bu': 2, 'Ross Perot': 1 })
  })

  test('supports write-ins', () => {
    const results2 = tallyVotes(sampleVotes.ballot_items_by_id, [
      ...sampleVotes.votes,
      { president_1: 'Abraham Lincoln', tracking: '1111-1111-1111' },
      { president_1: 'Abraham Lincoln', tracking: '2222-2222-2222' },
      { president_1: 'Abraham Lincoln', tracking: '3333-3333-3333' },
      {
        president_1: 'George H. W. Bu',
        president_2: 'Ross Perot',
        president_3: 'Abraham Lincoln',
        tracking: '4444-4444-4444',
      },
    ])
    const { rounds, winners } = results2.irv.president
    expect(winners[0]).toEqual('Bill Clinton')
    expect(rounds.length).toEqual(3)
    expect(rounds[2].tallies).toEqual({ 'Abraham Lincoln': 4, 'Bill Clinton': 5 })
  })

  test.todo('handles when there are a large number of distinct write-ins') // See https://siv.org/election/1721314324882

  test.todo('handles when there is a tie in the bottom choice')
  test.todo('handles when there is a tie in the top choice early on')
  test.todo('handles when there is a tie in the final round')
  test.todo('handles when there are a two digit number of multiple_votes_allowed')
})

// Multi-winner RCV Tallying tests
// 10 votes total
// threshold = 3.333
// Yang - 4
// Bill - 3
// George - 2
// Perot - 0
// Lincoln - 1

const sampleTwoWinnerVotes = {
  ballot_items_by_id: {
    president: {
      id: 'president',
      multiple_votes_allowed: 4,
      number_of_winners: 2,
      options: [{ name: 'George H. W. Bush' }, { name: 'Bill Clinton' }, { name: 'Ross Perot' }, {name: 'Abraham Lincoln'}, {name: 'Andrew Yang'}],
      title: 'Who should become President?',
      type: 'ranked-choice-irv',
      write_in_allowed: false
    },
  },
  votes: [
    {
      president_1: 'Bill Clinton',
      president_2: 'George H. W. Bu',
      president_3: 'Ross Perot',
      president_4: 'Abraham Lincoln',
      tracking: '3995-6836-1505',
    },
    {
      president_1: 'Bill Clinton',
      president_2: 'Ross Perot',
      president_3: 'George H. W. Bu',
      president_4: 'Abraham Lincoln',
      tracking: '5225-1927-5026',
    },
    {
      president_1: 'George H. W. Bu',
      president_2: 'Bill Clinton',
      president_3: 'Ross Perot',
      president_4: 'Abraham Lincoln',
      tracking: '5242-3203-2884',
    },
    {
      president_1: 'Abraham Lincoln',
      president_2: 'Bill Clinton',
      president_3: 'Ross Perot',
      president_4: 'George H. W. Bu',
      tracking: '1234-5678-9012',
    },
    {
      president_1: 'Bill Clinton',
      president_2: 'Andrew Yang',
      president_3: 'George H. W. Bu',
      president_4: 'Abraham Lincoln',
      tracking: '9876-5432-1098',
    },
    {
      president_1: 'Andrew Yang',
      president_2: 'Bill Clinton',
      president_3: 'George H. W. Bu',
      president_4: 'Abraham Lincoln',
      tracking: '9876-5432-1097',
    },
    {
      president_1: 'Andrew Yang',
      president_2: 'Abraham Lincoln',
      president_3: 'George H. W. Bu',
      president_4: 'Ross Perot',
      tracking: '9876-5432-1096',
    },
    {
      president_1: 'Andrew Yang',
      president_2: 'Bill Clinton',
      president_3: 'George H. W. Bu',
      president_4: 'Abraham Lincoln',
      tracking: '9876-5432-1095',
    },
    {
      president_1: 'Andrew Yang',
      president_2: 'Ross Perot',
      president_3: 'George H. W. Bu',
      president_4: 'Abraham Lincoln',
      tracking: '9876-5432-1094',
    },
    {
      president_1: 'Andrew Yang',
      president_2: 'George H. W. Bu',
      president_3: 'Ross Perot',
      president_4: 'Abraham Lincoln',
      tracking: '9876-5432-1093',
    },
  ],
}

const rcv_mw_results = tallyVotes(sampleTwoWinnerVotes.ballot_items_by_id, sampleTwoWinnerVotes.votes)

describe('MultiWinner RCV tallying', () => {
  test('results now includes an IRV key', () => {
    expect(rcv_mw_results).toHaveProperty('irv')
  })
  const { president } = rcv_mw_results.irv

  test('IRV items have a "rounds" subarray', () => {
    expect(president).toHaveProperty('rounds')
    expect(Array.isArray(president.rounds)).toBe(true)
  })
  const { rounds } = president

  test("can tally up everyone's top choices as round 1 votes", () => {
    expect(rounds[0].tallies).toEqual({ 'Abraham Lincoln': 1, 'Andrew Yang': 5, 'Bill Clinton': 3, 'George H. W. Bu': 1 })
  })

  test('can eliminate first place winner, and recalculate round 2 votes', () => {
    expect(rounds[1].tallies).toEqual({ 'Abraham Lincoln': 2, 'Bill Clinton': 5, 'George H. W. Bu': 2, 'Ross Perot': 1 })
  })

  test('shows the correct number of rounds', () => {
    expect(rounds).toHaveLength(2)
  })

  test('can declare two final winners', () => {
    expect(president.winners).toEqual(['Andrew Yang', 'Bill Clinton'])
  })
})
