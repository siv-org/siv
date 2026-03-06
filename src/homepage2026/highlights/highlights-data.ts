export const SECURITY_SOLUTIONS = [
  'Malware on voter devices',
  'Strong privacy',
  'Duplicate voting & ballot stuffing',
  'Coercion & vote selling risks',
  'Reliance on computers as ground truth',
  'Closed systems requiring blind trust',
]

export type DeploymentHighlight = {
  body: string
  id: string
  quote?: string
  tag: string
  title: string
}

export const DEPLOYMENTS: DeploymentHighlight[] = [
  {
    body: '',
    id: 'congress',
    tag: 'Government',
    title: 'Sitting Member of Congress elected using SIV',
  },
  {
    body: 'Groups with strong pre-existing distrust in US elections used SIV vs paper — leading to less fighting and more cooperation.',
    id: 'trust',
    quote: '\u201CThis is election nirvana\u201D \u00B7 \u201CWe were all pollwatchers today\u201D',
    tag: 'Trust',
    title: 'From distrust to cooperation',
  },
  {
    body: 'Switched to SIV for governance voting over funds worth millions.',
    id: 'zcash',
    tag: 'Governance',
    title: 'Zcash Foundation governance',
  },
  {
    body: 'Rep. allocated a $2M community budget and invited all constituents to participate.',
    id: 'harlem',
    tag: 'Participatory Budget',
    title: 'Harlem, New York',
  },
  {
    body: 'Used SIV to elect its leaders.',
    id: 'first-nation',
    tag: 'Global',
    title: 'Canadian First Nation government',
  },
  {
    body: 'SIV was not meant to replace other voting methods.',
    id: 'alongside',
    tag: 'Compatibility',
    title: 'Deployed alongside mail & in\u2011person voting',
  },
  {
    body: 'They can prove their elections were run fairly, it costs a fraction of their budget, and voters are asking for it.',
    id: 'officials',
    tag: 'Adoption',
    title: 'Election officials loved SIV',
  },
]
