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
  test('results now has an IRV key', () => {
    expect(results).toHaveProperty('irv')
  })
  const { irv } = results

  test('given votes including IRV, it reports *something* for that item', () => {
    expect(irv).toHaveProperty('president')
  })
  const { president } = irv

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

  test('correct number of rounds', () => {
    expect(rounds).toHaveLength(2)
  })

  test('can declare a final winner', () => {
    expect(president.winner).toEqual('Bill Clinton')
  })

  // see https://www.sfchronicle.com/bayarea/article/Alameda-County-admits-tallying-error-in-17682520.php
  test('can handle voters leaving blanks', () => {
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

  test("doesn't crash when there are no votes", () => {
    expect(() => tallyVotes(sampleVotes.ballot_items_by_id, [])).not.toThrow()
  })
  test.todo("doesn't crash when there is a tie in the bottom choice")
  test.todo("doesn't crash when there is a tie in the top choice early on")
  test('handles when a ballot runs out of non-eliminated candidates', () => {
    const results2 = tallyVotes(sampleVotes.ballot_items_by_id, [
      ...sampleVotes.votes,
      { president_1: 'BLANK', tracking: '3333-3333-3333' },
    ])
    // Since we only added a blank vote, the results should be the same
    expect(results2.irv.president.rounds[1].tallies).toEqual(results.irv.president.rounds[1].tallies)
  })
  test.todo('handles when there is a tie in the final round')
  test.todo('handles a ballot w/ multiple IRV items, and other types as well')
  test('good when someone wins in the first round', () => {
    const results2 = tallyVotes(sampleVotes.ballot_items_by_id, [
      ...sampleVotes.votes,
      { president_1: 'Bill Clinton', tracking: '3333-3333-3333' },
      { president_1: 'Bill Clinton', tracking: '4444-4444-4444' },
    ])
    const { rounds, winner } = results2.irv.president
    expect(winner).toEqual('Bill Clinton')
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
    const { rounds, winner } = results2.irv.president
    expect(winner).toEqual('Bill Clinton')
    expect(rounds.length).toEqual(3)
    expect(rounds[2].tallies).toEqual({ 'Abraham Lincoln': 4, 'Bill Clinton': 5 })
  })
})
