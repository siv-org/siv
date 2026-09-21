import poster from './PosterHighlights.png'

export type Group = {
  body?: string
  eyebrow: string
  sections: Section[]
  title: string
}

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

export const GROUPS: Group[] = [
  {
    body: '',
    eyebrow: '1',
    sections: [
      {
        body: [
          "In the Utah GOP's 2023 state leadership election, about 2,300 voters participated, with both paper and digital vote options. The digital results were tallied in ~45 seconds and everyone could recount the results & verify their vote was counted correctly. The paper process took 30+ minutes, required 10 staff members, involved a long line, and resulted in a counting error.",
        ],
        cite: 'https://blog.siv.org/2023/04/utah-gop-april-convention',
        eyebrow: 'Speed',
        stats: [
          { label: 'Digital tally', value: '~45 sec' },
          { label: 'Paper tally', value: '30+ min' },
          { label: 'Paper staff', value: '10' },
        ],
        title: 'Time savings',
      },
      {
        body: [
          'Adding a single question to the paper ballot for a State Senate special election required a $120k+ budget. Running the election primarily digitally required 77% less.',
        ],
        eyebrow: 'Cost',
        stats: [
          { label: 'Cost/Question (paper)', value: '$120k+' },
          { label: 'Budget Savings (digital)', value: '77%' },
        ],
        title: 'A fraction of the paper-based budget',
      },
    ],
    title: 'Faster, easier, and saves money',
  },
  {
    body: 'Voters want to vote from their devices, and the best officials want to meet them there.',
    eyebrow: '2',
    sections: [
      {
        body: [
          'SIV is meant to complement other voting methods, not replace them. People who prefer to vote in person or by mail should still be able to use those methods.',
          'SIV has already been successfully deployed alongside mail and in-person options:',
        ],
        cite: 'https://blog.siv.org/2025/12/11chooses',
        example: {
          body: 'Wide rural district, where many people could not take time off work. 98% voted digitally; 1 in 50 chose paper.',
          title: 'Utah State Senate, 70,000 eligible voters, Dec 2025',
        },
        eyebrow: 'Alongside, not instead',
        title: 'An additional option, not a replacement',
      },
    ],
    title: 'Meet voters where they are',
  },
  {
    body: "SIV lets honest election officials prove they're not cheating and their elections are fair.",
    eyebrow: '3',
    sections: [
      {
        body: [
          'With SIV, election officials can enable voters and auditors to independently verify the integrity of an election.',
          'The voter roll can be audited. Results can be verified end-to-end by auditors and voters, while keeping individual ballots private.',
          "One distinctive SIV feature is that voters and auditors don't need to inspect cryptographic hashes to verify the outcome. This makes the verification process drastically easier to understand and perform.",
          'If a problem does come up, it can be remediated ballot by ballot. There is no need to discard an entire election.',
          "And because verification of the voter roll, ballot secrecy, and result integrity can all happen after the polls close, verification doesn't depend entirely on catching problems at the time of voting, as many other systems do.",
        ],
        eyebrow: 'Trust',
        title: 'Auditability & public trust',
      },
      {
        cite: 'https://blog.siv.org/2025/11/siv-in-one-poster',
        eyebrow: 'SIV IN ONE POSTER',
        image: {
          alt: 'SIV Protocol Overview poster',
          src: poster.src,
        },
        title: 'Security properties',
      },
    ],
    title: 'Prove the election is fair',
  },
  {
    eyebrow: 'Also',
    sections: [
      {
        body: [
          'In Utah in 2025, a State Senator wanted to use Approval Voting rather than being limited to the "choosing-only-one" voting method. But the county could not offer other voting methods through its existing process.',
          'Digital voting on the other hand can support spoiler-resistant voting methods, with strong guardrails that help voters understand how to mark their ballots correctly.',
          'The State Senate race was ultimately conducted primarily digitally, using Approval Voting.',
        ],
        cite: 'https://blog.siv.org/2025/12/11chooses',
        eyebrow: 'Voting methods',
        title: 'Easy to integrate more voting methods',
      },
      {
        compare: true,
        eyebrow: 'Scoring SIV vs Mail vs In Person',
      },
    ],
    title: 'Additional benefits',
  },
]

export const SECTIONS: Section[] = GROUPS.flatMap((group) => group.sections)
