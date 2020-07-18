import SubmittedBallots from './all-submitted-ballots'
import Ballot from './ballot'
import EncryptionReceipt from './encryption-receipt'
import Invitation from './invitation'
import Plaintext from './plaintext'
import styles from './protocol.module.css'
import Sealed from './sealed'
import SecretID from './secret-id'
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

// Header
export const header = [
  { title: 'Secure Internet Voting (SIV) Protocol Overview' },
  { subtitle: 'Fast, Private, Verifiable' },
  {
    p: `Voting Method with mathematically provable privacy & vote verifiability.
        All over the internet, no installs necessary.`,
  },
]

export type ImageLine = { image: string; maxWidth: number }
export type Subsection = { subsection: { header: string; list: string[] } }
export type ReactLine = { react: () => JSX.Element }

export type Line = Record<string, string> | ImageLine | Subsection | ReactLine | ''

export type Step = { name: string; rest: Line[] }

export const prepSteps: Step[] = [
  // Pre-A
  {
    name: 'A: Voter Registration Period',
    rest: [
      {
        description: `Voting authority collects list of all valid voters, using the usual methods (in person, DMV, etc).`,
      },
      { details: "For this demo, let's pretend you're a voter named 'Adam Barton'." },
      { example: '' },
      { react: VoterList },
      { p: 'Individuals voters must opt-in to SIV by registering their email address with their Voting Authority.' },
    ],
  },

  // Pre-B
  {
    name: 'B: Shufflers Registered',
    rest: [
      {
        description: `Shufflers — to ensure the privacy of the vote — need to be enrolled ahead of time.`,
      },
      {
        details: `Requirements:
          1. They will need their phone or computer to be online and running a special SIV Shuffling program when the voting period closes.
          2. To enroll, they need to generate a private key, and share the corresponding public key with the voting authority.

          Their job will be explained in Step 5, but their public keys are needed for voters to seal their votes in Step 2.`,
      },
    ],
  },

  // Pre-C
  {
    name: 'C: Ballot Finalized',
    rest: [
      { example: '' },
      { react: Ballot() },
      { details: 'There can be multiple questions, as many as the election requires.' },
    ],
  },
]

const steps: Step[] = [
  // Step 1
  {
    name: 'Step 1: Invitation to Vote',
    rest: [{ description: 'Voting authority sends individualized email to all voters.' }, { react: Invitation }],
  },

  // Step 2
  {
    name: 'Step 2: Mark & Encrypt Your Ballot',
    rest: [
      {
        description: `Voter fills out their ballot & encrypts it.`,
      },
      '',
      { p: 'Voter sees a GUI to make it easy to fill out their ballot:' },
      { react: Ballot(true) },
      '',
      { html: `At the end, there's a special ${em('Secret ID')} section.` },
      '',
      { react: SecretID },
      '',
      { html: `This example results in a ${blue(semibold('plaintext ballot'))} like:` },
      { react: Plaintext },
      '',
      '',
      '',
      {
        html: `Then the ${blue(semibold('plaintext ballot'))} can be sealed, resulting in an ${purple(
          semibold('encrypted ballot'),
        )} like:`,
      },
      { react: Sealed },
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
      // { html: `This step is completed by using a ${green(semibold('SIV Sealing Tool'))}:` },
      // { image: 'step-2g-tool-options.png', maxWidth: 462 },
      '',
      {
        html: `You can download an Encryption Receipt, allowing you or 3rd-party auditors to verify that everything worked as intended.<br />
        ${light(`This is optional. It helps prove or disprove claims of improper results.`)}`,
      },
      { react: EncryptionReceipt },
    ],
  },

  // Step 3
  {
    name: 'Step 3: Submit Encrypted Ballot',
    rest: [
      {
        description:
          'The Voter submits their encrypted ballot to the Voting Authority, along with their unique Vote Token.',
      },
      {
        html: `Voting authority confirms the ${red(
          semibold('Vote Token'),
        )} matches an eligible voter, and hasn't already been used.`,
      },
      '',
      { react: YourSubmittedBallot },
      {
        details:
          'If it passes, the Voting Authority adds the encrypted ballot to a public list of all ballots received so far.',
      },
      '',
      { react: SubmittedBallots },
      '',
      {
        html: `The Voting Authority has no way to know how a voter voted. Still, they can send voters an email confirmation that their encrypted ballot has been received and accepted.<br />
        ${light(
          `This lets the voter know their job is done. It also alerts the voter in case someone else somehow gained access to their vote token. And it serves as a written receipt that the vote was accepted, to allow for auditing.`,
        )}`,
      },
      '',
    ],
  },

  // Step 4
  {
    name: 'Step 4: Voting Period Closes',
    rest: [
      { description: 'Election Authority reveals the names of everyone who submitted a valid Vote Token.' },
      {
        html: `${light(
          `Who voted, but not ${em('how')} anyone voted (which they couldn’t reveal even if they wanted to).`,
        )}`,
      },
      '',
      { react: WhoVoted },
      '',
      {
        details: `This creates greater trust by showing who the voters are. The public can see they’re real valid voters. Not people voting multiple times, or "dead people", or foreigners, etc., as skeptics worry about.

          This also helps watchdogs pick a random sample of voters to conduct independent audits of the vote’s validity. With individual voters' permission, they can check reported results against voter receipts.`,
      },
    ],
  },

  // Step 5
  {
    name: 'Step 5: Verifiable Shuffle',
    rest: [
      {
        html: `<p class="${
          styles.description
        }">Encrypted votes are verifiable shuffled by a pool of 3rd-party shufflers. This protects voters’ privacy by removing the ${red(
          semibold('Vote Tokens'),
        )}, while still mathematically proven to preserve the ${purple(semibold('sealed vote contents'))}.</p>`,
      },
      '',
      '',
      { image: 'step-5-shuffle.png', maxWidth: 490 },
      '',
      '',
      '',
      {
        html: `Multiple people can shuffle, like multiple people shuffling a deck of cards.<br />
          ${red(`Privacy is ensured by ${em('at least one')} honest shuffler.`)}`,
      },
      {
        details: `Thus, greater trust is ensured by more shufflers.
    This entire step can still be completed in just a few minutes.

    The only requirement is that shufflers are online (connected to the internet), and running the open-source SIV shuffling software, to automatically handle their part.`,
      },
    ],
  },

  // Step 6
  {
    name: 'Step 6: Unsealing Stage',
    rest: [
      {
        html: `<p class="${styles.description}">Then ${green(
          semibold('95% of shufflers'),
        )} can sign off that they're ready for the final ${purple(semibold('shuffled list'))} to be ${blue(
          semibold('Unsealed'),
        )}.</p>`,
      },
      '',
      { image: 'step-6-threshold-key.png', maxWidth: 470 },
      { html: blue(semibold('Unlocks the vote contents of the final list only, but not Vote Tokens.')) },
      '',
      '',
      '',
      '',
      {
        html: `
            <code>${blue(`
            1. {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vote_for_mayor: ‘london_breed’,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;verification_note: ‘Auto-generated: 76cbd63fa94eba743d5’,<br />
              &nbsp;&nbsp;&nbsp;}<br />
              <br />
            2. {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vote_for_mayor: ‘mark_leno’,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;verification_note: ‘Auto-generated: 6705b9b9443d077cf7’,<br />
              &nbsp;&nbsp;&nbsp;}<br />
              <br />
            3. {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vote_for_mayor: ‘london_breed’,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;verification_note: ‘quick_brown_fox’,<br />
              &nbsp;&nbsp;&nbsp;}<br />
              <br />
              ...<br />
              <br />
            300,000. {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vote_for_mayor: ‘london_breed’,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;verification_note: ‘Auto-generated: 76cbd63fa94eba743d5’,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br />
            `)}</code>
          `,
      },
      '',
      '',
      {
        p: `Now, anyone can tally the final vote count themselves.

    Any voter can Search (Ctrl+F) to find their personal vote via the Verification Note line, to see it was entered correctly.`,
      },
    ],
  },
]

export default steps
