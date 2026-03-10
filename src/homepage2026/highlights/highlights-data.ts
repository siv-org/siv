export type Highlight = {
  body?: string
  href?: string
  items?: string[]
  quotes?: string[]
  tag: string
  title: string
}

/** Unified highlights: news/latest first (with links), then evergreen highlights. */
export const HIGHLIGHTS: Highlight[] = [
  {
    body: 'For each paper voter, 50x voted digitally.',
    href: 'https://blog.siv.org/2025/12/11chooses',
    tag: 'Latest • December 2025',
    title: 'Multiple historic firsts, including the biggest digital election in US history',
  },
  {
    body: 'Preserving privacy & verifiability.',
    href: 'https://blog.siv.org/2025/08/overrides',
    tag: 'Security',
    title: 'Anti-coercion & vote-selling solution, deployed',
  },
  {
    body: '$10,000 prizes. Top security researchers.',
    href: 'https://hack.siv.org/reports/2024defcon',
    tag: 'Security',
    title: 'DEF CON Red-Team Hack\u00A0SIV Challenge: Results',
  },
  {
    href: 'https://blog.siv.org/2023/11/utah-gop-special-election',
    tag: 'Congressional Election',
    title: 'Sitting Member of US Congress elected using SIV',
  },
  {
    body: 'For decades, digital voting was correctly considered unsafe for high-stakes settings.\n\nSIV has solved:',
    href: 'https://blog.siv.org/2025/11/siv-in-one-poster',
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
    body: 'Groups with strong pre-existing distrust in US elections used SIV vs paper — leading to less fighting and more cooperation.',
    href: 'https://blog.siv.org/2023/04/utah-gop-april-convention',
    quotes: ['This is election nirvana.', 'Today, we were all pollwatchers.'],
    tag: 'Trust',
    title: 'From distrust to cooperation',
  },
  {
    body: 'Representative invited all residents to jointly allocate $2M community-improvement budget.',
    href: 'https://blog.siv.org/2023/06/harlem-wallet',
    tag: 'Participatory Budgeting',
    title: 'Harlem, New York',
  },
  {
    body: 'Switched to SIV for governance voting over funds worth millions.',
    href: 'https://forum.zcashcommunity.com/t/request-for-zcap-members-thoughts-on-moving-from-helios-to-siv-for-future-voting/51785',
    tag: 'Governance Voting',
    title: 'Zcash Foundation governance',
  },
  {
    body: 'Used SIV to elect its leaders, giving voters options to vote online or in person.',
    tag: 'Government Election',
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
