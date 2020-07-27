import SubmittedBallots from './all-submitted-ballots'
import Ballot from './ballot'
import EncryptionReceipt from './encryption-receipt'
import { Invitation, InvitationExplanation } from './Invitation'
import Plaintext from './plaintext'
import Sealed from './sealed'
import SecretID from './secret-id'
import Unlocked from './unlocked'
import VoterList from './voter-list'
import WhoVoted from './who-voted'
import YourSubmittedBallot from './your-submitted-ballot'

const colorize = (color: string) => (text: string) => `<span style="color: ${color};">${text}</span>`
const blue = colorize('#1332fe')
const red = colorize('#d0021b')
const purple = colorize('#9013fe')
const green = colorize('#417505')

const semibold = (text: string) => `<span style="font-weight: 600;">${text}</span>`
const light = (text: string) => `<span style="font-size: 12px; opacity: 0.65;">${text}</span>`
const em = (text: string) => `<em>${text}</em>`

export type ImageLine = { image: string; maxWidth: number }
export type Subsection = { subsection: { header: string; list: string[] } }
export type ReactLine = { react: () => JSX.Element }

export type Line = Record<string, string> | ImageLine | Subsection | ReactLine | ''

export type Step = { leftFirst?: boolean; name: string; subheader?: string; then: { left: Line[]; right?: Line[] }[] }
type Milestone = string

export const steps: (Step | Milestone)[] = [
  // Milestone
  'Before the Election',

  // Pre-A
  {
    name: 'Prep A: Voter Registration Period',
    subheader: `Election administrator collects list of all valid voters, using the usual methods (in person, DMV, etc).`,
    then: [
      {
        left: [
          {
            p:
              'Individuals voters should opt-in to SIV by registering an email address with their election administrator.',
          },
        ],
        right: [
          { html: light("For this demo, we'll pretend you're a voter named 'Adam Barton'.") },
          '',
          { react: VoterList },
        ],
      },
    ],
  },

  // Pre-B
  {
    name: 'Prep B: Trustees Registered',
    subheader: `Trustees — who ensure the privacy of the vote — are enrolled ahead of time.`,
    then: [
      {
        left: [
          {
            details: `Requirements:

          1. They will need their phone or computer online with the SIV Shuffling program open when the voting period closes.

          2. To enroll, they need to generate a private key, and take part in a Threshold Key generation process with the election admin to create the corresponding public key.

          Their Shuffling job is explained in Step 5, but their public keys are needed ahead-of-time for voters to encrypt their votes in Step 2.`,
          },
        ],
      },
    ],
  },

  // Pre-C
  {
    name: 'Prep C: Ballot Finalized',
    subheader: 'The official ballot is finalized, as with traditional paper elections.',
    then: [
      {
        left: [
          { details: 'There can be multiple questions, as many as the election requires.' },
          {
            html: light(
              'SIV is 100% compatible with — and makes it easier to adopt — voting methods meant to improve upon the Choose-Only-One system, such as Ranked Choice Voting, Approval Voting, and Score Voting.',
            ),
          },
          '',
        ],
        right: [{ react: Ballot() }],
      },
    ],
  },

  // Milestone
  'Voting Begins',

  // Step 1
  {
    name: 'Step 1: Invitation to Vote',
    subheader: 'Election administrator sends individualized invitations to all enrolled voters.',
    then: [
      {
        left: [{ react: InvitationExplanation }],
        right: [{ react: Invitation }],
      },
    ],
  },

  // Step 2
  {
    leftFirst: true,
    name: 'Step 2: Mark & Encrypt Your Ballot',
    subheader: `Voter fills out their ballot & encrypts it.`,
    then: [
      {
        left: [{ p: 'Voter sees a GUI to make it easy to fill out their ballot:' }],
        right: [{ react: Ballot(true) }],
      },
      {
        left: [{ html: `At the end, there's a special ${em('Secret ID')} section.` }],
        right: [{ react: SecretID }],
      },
      {
        left: [{ html: `This example results in a ${blue(semibold('plaintext ballot'))} like:` }],
        right: ['', { react: Plaintext }],
      },
      { left: ['', ''] },
      {
        left: [
          {
            html: `Then the ${blue(semibold('plaintext ballot'))} can be sealed, resulting in an ${purple(
              semibold('encrypted ballot'),
            )} like:`,
          },
        ],
        right: ['', { react: Sealed }],
      },
      {
        left: [
          {
            subsection: {
              header: 'Encrypted Ballots',
              list: [
                `${semibold('can be safely shared')}, without revealing any content of vote.<br />
                  ${light('The encryption acts like a locked safe.')}`,

                `can ${semibold('only be unlocked by special key')}— explained in final step.`,
              ],
            },
          },
          '',
          '',
        ],
      },
      // { html: `This step is completed by using a ${green(semibold('SIV Sealing Tool'))}:` },
      // { image: 'step-2g-tool-options.png', maxWidth: 462 },
      {
        left: [
          {
            html: `You can download an Encryption Receipt, allowing you or 3rd-party auditors to verify that everything worked as intended.<br />
          ${light(`This is optional. It helps prove or disprove claims of improper results.`)}`,
          },
        ],
        right: ['', { react: EncryptionReceipt }],
      },

      {
        left: [
          '',
          '',
          '',
          {
            html: `For extra security, this encryption step can be completed while offline (e.g. in airplane mode) and in a sandboxed incognito tab. <br />
          ${light(
            `This protects against the voting software itself being malicious, ensuring it can't possibly store any private vote information.`,
          )}`,
          },
        ],
      },
    ],
  },

  // Step 3
  {
    leftFirst: true,
    name: 'Step 3: Submit Encrypted Ballot',
    subheader: 'The voter sends their encrypted ballot + unique Vote Token to the election administrator.',
    then: [
      {
        left: [
          {
            html: `Election admin confirms the ${red(
              semibold('Vote Token'),
            )} matches an eligible voter, and hasn't already been used.`,
          },
        ],
        right: ['', '', { react: YourSubmittedBallot }, '', '', '', ''],
      },
      {
        left: [
          {
            details: 'If it passes, the admin adds the ballot to a public list of all ballots received so far.',
          },
        ],
        right: ['', { react: SubmittedBallots }, '', ''],
      },
      {
        left: [
          {
            html: `The election administrator has no way to know how a voter voted. Still, they can email voters a confirmation that their encrypted ballot has been received and accepted.<br />
            ${light(
              `This lets the voter know their job is done. It also alerts the voter in case someone else somehow gained access to their vote token. And it serves as a written receipt that the vote was accepted, to allow for auditing.`,
            )}`,
          },
        ],
      },
    ],
  },

  // Milestone
  'Voting Period Closes',

  // Step 4
  {
    name: 'Step 4: Voters Identified',
    subheader: 'Election administrator reveals the names of everyone who submitted a valid Vote Token.',
    then: [
      {
        left: [
          '',
          {
            html: `This creates greater trust by showing who the voters are. The public can see they’re real valid voters. Not people voting multiple times, or "dead people", or foreigners, etc., as skeptics worry about.<br />
        <br />
        ${light(
          `This also helps watchdogs pick a random sample of voters to conduct independent audits of the vote’s validity. With individual voters' permission, they can check reported results against voter receipts.`,
        )}`,
          },
          '',
        ],
        right: [
          '',
          {
            html: `${light(
              `Who voted, but not ${em('how')} anyone voted (which they couldn’t reveal even if they wanted to).`,
            )}`,
          },
          '',
          { react: WhoVoted },
          '',
          '',
        ],
      },
    ],
  },

  // Step 5
  {
    name: 'Step 5: Verifiable Shuffle',
    then: [
      {
        left: [
          {
            html: `<p style="font-size: 15px; font-weight: 700;">Encrypted votes are verifiably shuffled by a pool of 3rd-party Trustees. This protects voters’ privacy by removing the ${red(
              semibold('Vote Tokens'),
            )}, while still mathematically proven to preserve the ${purple(semibold('encrypted vote contents'))}.</p>`,
          },
          '',
          '',
          {
            html: `Multiple people can shuffle, like multiple people shuffling a deck of cards.<br />
            ${red(`Privacy is ensured by ${em('at least one')} honest Trustee.`)}`,
          },
          {
            details: `Thus, greater trust is ensured by more Trustees.


            This entire step can still be completed in just a few minutes.


            The only requirement is that Trustees are online and running the SIV shuffling software. This software automatically handles their parts.`,
          },
        ],
        right: ['', '', { image: 'step-5-shuffle.png', maxWidth: 490 }],
      },
    ],
  },

  // Step 6
  {
    name: 'Step 6: Unlocking Stage',
    then: [
      {
        left: [
          {
            html: `<p style="font-size: 15px; font-weight: 700;">Then a ${green(
              semibold('quorum of Trustees'),
            )} can sign off that they're ready for the final ${purple(semibold('shuffled list'))} to be ${blue(
              semibold('Unlocked'),
            )}.</p>`,
          },
          '',
        ],
        right: ['', '', '', { image: 'step-6-threshold-key.png', maxWidth: 470 }, '', ''],
      },
      {
        left: [
          {
            html: `Unlocks the ${blue(semibold('vote contents'))} of the final list only, not Vote Tokens. ${em(
              'Preserves privacy.',
            )}`,
          },
          '',
          '',
          {
            p: `Any voter can Search (Ctrl+F) to find their individual vote, via their Secret Identifier, and see that their vote was counted correctly.`,
          },
          '',
          '',
          '',
          { details: `Anyone can tally the final vote count themselves.` },
        ],
        right: [{ react: Unlocked }, ''],
      },
    ],
  },
]
