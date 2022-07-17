const cats = { acc: 'Accurate Results', costs: 'Costs', hon: 'Honest Vote Selections', ux: 'Voter Experience' }

type Row = { cat: string; d_prop: string; desc: string; scores: [number, number, number] }

export const tableData: Row[] = [
  {
    cat: cats.acc,
    d_prop: 'Auditable Voter Authentication',
    desc: 'How sure are we that only legitimate voters are voting, and only once each?',
    scores: [7, 5, 7],
  },
  {
    cat: cats.acc,
    d_prop: 'Verifiable results',
    desc: 'How sure are we that the votes were tallied up correctly, without any votes lost or modified?',
    scores: [5, 3, 9],
  },
  {
    cat: cats.hon,
    d_prop: 'Vote privacy',
    desc: 'How confident can individual voters be that no one else will learn their ballot selections?',
    scores: [6, 4, 8],
  },
  {
    cat: cats.hon,
    d_prop: 'Coercion resistance',
    desc: 'How protected are voters against attempts to threaten or purchase their vote selections?',
    scores: [7, 5, 4],
  },
  {
    cat: cats.ux,
    d_prop: 'Accessibility',
    desc: 'How accessible is the voting process for all members of the electorate, especially those with disabilities?',
    scores: [5, 6, 8],
  },
  {
    cat: cats.ux,
    d_prop: 'Speed of voting',
    desc: 'How quickly can individual voters participate?',
    scores: [2, 7, 8],
  },
  {
    cat: cats.ux,
    d_prop: 'Speed of tallying',
    desc: 'How quickly can results be tallied?',
    scores: [4, 2, 9],
  },
  {
    cat: cats.costs,
    d_prop: 'Affordability to administer',
    desc: 'How affordable are the total costs to administer a secure election?',
    scores: [2, 4, 8],
  },
]
