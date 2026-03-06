export type Highlight = {
  body?: string
  id: string
  items?: string[]
  quote?: string
  tag: string
  title: string
  width: string
}

export const HIGHLIGHTS: Highlight[] = [
  {
    body: 'For decades, digital voting was correctly considered unsafe. SIV has solved:',
    id: 'security',
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
    width: 'w-[320px]',
  },
  {
    id: 'congress',
    tag: 'Government',
    title: 'Sitting Member of Congress elected using SIV',
    width: 'w-[240px]',
  },
  {
    body: 'Groups with strong pre-existing distrust in US elections used SIV vs paper — leading to less fighting and more cooperation.',
    id: 'trust',
    quote: '\u201CThis is election nirvana\u201D \u00B7 \u201CWe were all pollwatchers today\u201D',
    tag: 'Trust',
    title: 'From distrust to cooperation',
    width: 'w-[300px]',
  },
  {
    body: 'Switched to SIV for governance voting over funds worth millions.',
    id: 'zcash',
    tag: 'Governance',
    title: 'Zcash Foundation governance',
    width: 'w-[240px]',
  },
  {
    body: 'Rep. allocated a $2M community budget and invited all constituents to participate.',
    id: 'harlem',
    tag: 'Participatory Budget',
    title: 'Harlem, New York',
    width: 'w-[240px]',
  },
  {
    body: 'Used SIV to elect its leaders.',
    id: 'first-nation',
    tag: 'Global',
    title: 'Canadian First Nation government',
    width: 'w-[240px]',
  },
  {
    body: 'SIV was not meant to replace other voting methods.',
    id: 'alongside',
    tag: 'Compatibility',
    title: 'Deployed alongside mail & in\u2011person voting',
    width: 'w-[260px]',
  },
  {
    body: 'They can prove their elections were run fairly, it costs a fraction of their budget, and voters are asking for it.',
    id: 'officials',
    tag: 'Adoption',
    title: 'Election officials loved SIV',
    width: 'w-[280px]',
  },
]
