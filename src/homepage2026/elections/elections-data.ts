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
    category: 'April 2023 · Party Convention',
    description:
      'The Utah GOP’s first convention conducted with SIV. A group with strong pre-existing distrust in elections used SIV alongside paper — leading to less fighting and more cooperation. “This is election nirvana.”',
    href: 'https://blog.siv.org/2023/04/utah-gop-april-convention',
    title: 'Utah GOP First Convention',
  },
  {
    category: 'November 2023 · Congressional Race',
    description:
      'Rep. Celeste Maloy won the nomination for Utah’s 2nd Congressional District in a SIV election, then the November general — becoming the first person elected through SIV to serve in the U.S. Congress.',
    href: 'https://blog.siv.org/2023/11/utah-gop-special-election',
    title: 'Celeste Maloy Congressional Race',
  },
  {
    category: 'May 2024 · Party Convention',
    description:
      'The Utah branch of the new Forward Party held its first statewide convention, using SIV and Approval Voting to set party priorities and nominate candidates. 908 votes were cast and tallied.',
    href: 'https://blog.siv.org/2024/05/forward-utah',
    title: 'Utah Forward Party First Convention',
  },
  {
    category: 'June 2023 · Participatory Budgeting',
    description:
      'A New York representative invited all residents of Harlem to jointly allocate a $2M community-improvement budget.',
    href: 'https://blog.siv.org/2023/06/harlem-wallet',
    title: 'Harlem, NY $2M Participatory Budgeting',
  },
  {
    category: 'July 2024 · Open Primary',
    description:
      'An open, publicly auditable effort to find a popular replacement after widespread calls for President Biden to drop out following his disastrous debate.',
    href: 'https://newdemocraticprimary.org/',
    title: 'New Democratic Primary',
  },
  {
    category: 'August 2024 · Security',
    description:
      'Run for a highly technical, security-minded audience at DEF CON. A public vote awarded $5k in prizes to the top red-team submissions. See the “Public Prize Awarding Process” subsection for details.',
    href: 'https://hack.siv.org/reports/2024defcon#hack-siv-detailed-information',
    secondaryHref: 'https://hack.siv.org/reports/2024defcon',
    secondaryLabel: 'Full red-teaming contest writeup',
    title: 'DEF CON Hack SIV Prize Awarding Vote',
  },
  {
    category: 'December 2025 · Government Election',
    description:
      'The largest digital election in US history. The Forward Party of Utah opened a midterm replacement vote to all registered voters in Utah Senate District 11, regardless of party affiliation.',
    href: 'https://blog.siv.org/2025/12/11chooses',
    title: '11chooses',
  },
]
