export type Highlight = {
  body?: string
  /** Short blurb for link cards (e.g. news). */
  description?: string
  href?: string
  items?: string[]
  quotes?: string[]
  tag: string
  title: string
}

/** Unified highlights: news/latest first (with links), then evergreen highlights. */
export const HIGHLIGHTS: Highlight[] = [
  {
    description: 'For each paper voter, 50x voted digitally.',
    href: 'https://blog.siv.org/2025/12/11chooses',
    tag: 'Latest',
    title: 'Multiple historic firsts, including the biggest digital election in US history',
  },
  {
    description: 'Preserving privacy & verifiability.',
    href: 'https://blog.siv.org/2025/08/overrides',
    tag: 'Latest',
    title: 'Anti-coercion & vote-selling solution, deployed',
  },
  {
    description: '$10,000 prizes. Top security researchers.',
    href: 'https://hack.siv.org/reports/2024defcon',
    tag: 'Latest',
    title: 'DEF CON Red-Team Hack\u00A0SIV Challenge: Results',
  },
  {
    body: 'For decades, digital voting was correctly considered unsafe for high-stakes settings.\n\nSIV has solved:',
    items: [
      'Malware on voter devices',
      'Strong privacy',
      'Duplicate voting & ballot stuffing',
      'Coercion & vote selling risks',
      'Reliance on computers as ground truth',
      'Closed systems requiring blind trust',
    ],
    tag: 'Security',
    title: 'Strong solutions, built & deployed',
  },
  {
    tag: 'Government',
    title: 'Sitting Member of Congress elected using SIV',
  },
  // {
  //   body: 'Groups with strong pre-existing distrust in US elections used SIV vs paper — leading to less fighting and more cooperation.',
  //   quotes: ['This is election nirvana.', 'Today, we were all pollwatchers.'],
  //   tag: 'Trust',
  //   title: 'From distrust to cooperation',
  // },
  {
    body: 'Switched to SIV for governance voting over funds worth millions.',
    tag: 'Governance',
    title: 'Zcash Foundation governance',
  },
  {
    body: 'Rep. invited all residents to jointly allocate $2M community-improvement budget.',
    tag: 'Participatory Budgeting',
    title: 'Harlem, New York',
  },
  {
    body: 'Used SIV to elect its leaders.',
    tag: 'Global',
    title: 'Canadian First Nation government',
  },
  {
    body: 'SIV is meant to complement, not replace other voting methods.',
    tag: 'Compatibility',
    title: 'Deployed alongside mail & in\u2011person voting',
  },
  // {
  //   body: 'They can prove their elections were run fairly, it costs a fraction of their existing budget, and voters are asking for it.',
  //   tag: 'Adoption',
  //   title: 'Election officials love SIV',
  // },
]
