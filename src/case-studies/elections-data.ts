export type Election = {
  category: string
  description: string
  href: string
  /** Optional secondary link, e.g. a specific subsection of a larger report. */
  secondaryHref?: string
  secondaryLabel?: string
  title: string
}

export const ELECTIONS: Election[] = [
  {
    category: 'December 2025 · State Senate Election',
    description:
      'The largest digital election in US history. The Forward Party of Utah opened a midterm replacement vote to all registered voters in Utah Senate District 11, regardless of party affiliation. The winner was sworn in the morning after voting closed as the latest State Senator.',
    href: 'https://blog.siv.org/2025/12/11chooses',
    title: 'Utah State Senate replacement race, 70k eligible voters',
  },
  {
    category: 'August 2024 · HACK SIV Challenge',
    description:
      'Run for a highly technical, security-minded audience at DEF CON. $10,000 in prizes, with a public vote which awarded $5k in prizes to the top red-team submissions.',
    href: 'https://hack.siv.org/reports/2024defcon',
    secondaryHref:
      'https://hack.siv.org/reports/2024defcon#:~:text=But%20we%20needed%20to%20protect%20against%20a%20few%20unique%20threats%2C%20detailed%20below',
    secondaryLabel: 'Public Prize Awarding Process',
    title: 'DEF CON Hack SIV Prize Awarding Vote',
  },
  {
    category: 'July 2024 · Open Primary',
    description:
      'An open, publicly auditable effort to find a popular replacement after widespread calls for President Biden to drop out following surprisingly poor debate performance. The goal was to allow hundreds of millions of Americans to securely weigh in, with strong authentication, and a ranked choice among 9 top presidential choices.',
    href: 'https://newdemocraticprimary.org/results',
    title: 'New Democratic Primary',
  },
  {
    category: 'May 2024 · Party Convention',
    description:
      'The Utah branch of the new Forward Party held its first statewide convention, using SIV and Approval Voting to set party priorities and nominate candidates. 908 votes were cast and tallied.',
    href: 'https://blog.siv.org/2024/05/forward-utah',
    title: 'Utah Forward Party State Convention',
  },
  {
    category: 'November 2023 · Congressional Race',
    description:
      'Rep. Celeste Maloy won the nomination for Utah’s 2nd Congressional District in a SIV election, then the November general, becoming the first person elected through SIV to serve in the U.S. Congress.',
    href: 'https://blog.siv.org/2023/11/utah-gop-special-election',
    title: 'Celeste Maloy Congressional Race',
  },
  {
    category: 'June 2023 · Participatory Budgeting',
    description:
      'A New York representative invited all residents of Harlem to jointly allocate a $2M community-improvement budget.',
    href: 'https://blog.siv.org/2023/06/harlem-wallet',
    title: 'Harlem, NY $2M Participatory Budgeting',
  },
  {
    category: 'April 2023 · Party Convention',
    description:
      'People could choose between voting via SIV or paper. After election, people said “This is election nirvana”, "We were all pollwatchers today".',
    href: 'https://blog.siv.org/2023/04/utah-gop-april-convention',
    title: 'Utah GOP State Convention',
  },
]
