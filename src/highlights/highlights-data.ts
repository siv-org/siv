import poster from './PosterHighlights.png'

export type Section =
  | {
      /** Homepage CompareSection — not copy. */
      compare: true
      eyebrow: string
    }
  | {
      body?: string[]
      cite?: string
      example?: { body: string; title: string }
      eyebrow: string
      image?: { alt: string; src: string }
      stats?: Stat[]
      title: string
    }

export type Stat = { label: string; value: string }

export const SECTIONS: Section[] = [
  {
    body: [
      'SIV is meant to complement other voting methods, not replace them. People who prefer in-person or mail-in voting should be able to still use these methods.',
      'SIV has been successfully deployed alongside mail and in-person voting. The latest example was a Utah State Senate race in 2025, with 70,000 eligible voters.',
    ],
    cite: 'https://blog.siv.org/2025/12/11chooses',
    example: {
      body: 'The district was wide and rural, and many people could not take time off work. 98% of voters chose to vote digitally — only 1 in 50 chose in-person paper ballots.',
      title: 'Utah State Senate Race, December 2025',
    },
    eyebrow: '1 · Alongside, not instead',
    title: 'Digital as an additional voting option, not a replacement',
  },
  {
    body: [
      'In Utah’s 2025 midterm-replacement State Senate vote, run by the Forward Party, the sitting Senator wanted to offer his constituents a better method than “choose only one.”',
      'The county option could not support the preferred method — Approval Voting — only single-choice. The election would have gotten a worse voting method, and paid more for it.',
      'Digitally, we can offer spoiler-free voting methods, with stronger guardrails so voters clearly understand how to vote and don’t spoil their ballot.',
    ],
    cite: 'https://blog.siv.org/2025/12/11chooses',
    eyebrow: '2 · Voting methods',
    title: 'Offering smarter voting methods',
  },
  {
    body: [
      'For a State Senate special election, the election department quoted more than $130,000 for adding one question to the ballot. Running the vote primarily digitally cut 77% of the costs.',
    ],
    eyebrow: '3 · Cost',
    stats: [
      { label: 'One question, paper vote', value: '$130k+' },
      { label: 'Cost cut when digital', value: '77%' },
    ],
    title: 'Long-term cost savings',
  },
  {
    body: [
      'At the 2023 Utah GOP convention, with about 2,300 voters, the digital SIV tally finished in about 45 seconds. Paper took 20+ minutes and 10 staff — and produced an off-by-one human counting error.',
    ],
    cite: 'https://blog.siv.org/2023/04/utah-gop-april-convention',
    eyebrow: '4 · Speed',
    stats: [
      { label: 'Digital tally', value: '~45 sec' },
      { label: 'Paper tally', value: '20+ min' },
      { label: 'Paper staff', value: '10' },
    ],
    title: 'Time savings',
  },
  {
    compare: true,
    eyebrow: '5 · Scoring SIV vs Mail vs In Person',
  },
  {
    body: [
      'With SIV, election officials can enable voters and auditors to personally verify the integrity of the vote.',
      'Every name on the voter roll can be audited, and results can be verified end to end by auditors and voters alike, all while keeping every ballot private.',
      'What makes SIV unique: voters and auditors don’t need to check cryptography / hashes to confirm the outcome. Voters can see their own vote in plain text and know it was recorded correctly.',
      'If a problem does come up, it can be fixed ballot by ballot. There’s no need to throw out an entire election.',
      'And because every check (the voter roll, ballot secrecy, and the integrity of the results) can happen after the polls close, verification doesn’t depend on catching problems in the moment, as many other systems do.',
    ],
    eyebrow: '6 · Trust',
    title: 'Auditability & public trust',
  },
  {
    cite: 'https://blog.siv.org/2025/11/siv-in-one-poster',
    eyebrow: '7 · SIV IN ONE POSTER',
    image: {
      alt: 'SIV Protocol Overview poster',
      src: poster.src,
    },
    title: 'Security properties',
  },
]
