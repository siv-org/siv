import { AllSubmittedBallots } from './AllSubmittedBallots'
import { Ballot } from './Ballot'
import { BallotDesigner } from './BallotDesigner'
import { EncryptedVote } from './EncryptedVote'
import { EncryptionReceipt } from './EncryptionReceipt'
import { Invitation, InvitationExplanation } from './Invitation'
import { Plaintext } from './Plaintext'
import { Reencryption } from './Reencryption'
import { RemoveAuthTokens } from './RemoveAuthTokens'
import { ShuffleVotes } from './ShuffleVotes'
import { SubmissionConfirmation } from './SubmissionConfirmation'
import { Unlocked } from './Unlocked'
import { VerificationSecret } from './VerificationSecret'
import { VoterList } from './VoterList'
import { YourSubmittedBallot } from './YourSubmittedBallot'

const colorize = (color: string) => (text: string) => `<span style="color: ${color};">${text}</span>`
const blue = colorize('#1332fe')
const orange = colorize('#e67e37')
const purple = colorize('#9013fe')

const semibold = (text: string) => `<span style="font-weight: 600;">${text}</span>`
const light = (text: string) => `<span style="font-size: 12px; opacity: 0.65;">${text}</span>`
const em = (text: string) => `<em>${text}</em>`

export type ImageLine = { image: string; maxWidth: number }
export type Subsection = { subsection: { header: string; list: string[] } }
export type ReactLine = { react: () => JSX.Element }

export type Line = Record<string, string> | ImageLine | Subsection | ReactLine | ''

export type Step = { leftFirst?: boolean; name: string; subheader: string; then: { left: Line[]; right?: Line[] }[] }

type Group = { group: string; steps: Step[] }

export const groupedSteps: Group[] = [
  {
    group: 'Before the Election',
    steps: [
      // Pre-req
      {
        name: 'Voter Registration',
        subheader: `Election administrator collects list of all valid voters, via the same methods as currently used.`,
        then: [
          {
            left: [
              '',
              '',
              {
                html: 'Individual voters should <a href="/#let-your-govt-know" target="_blank">opt-in to SIV</a> by registering an email address with their election administrator.',
              },
              '',
              {
                html: 'Using email is fast, easy, and highly affordable, but election administrator can also use other methods to contact voters, including traditional postal mail.',
              },
            ],
            right: [{ react: VoterList }],
          },
        ],
      },

      // Pre-req
      {
        name: 'Ballot Finalized',
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
            right: [{ react: BallotDesigner }],
          },
          { left: ['', '', '', ''] },
        ],
      },

      // Pre-req
      {
        name: 'Observer Registration',
        subheader: `Verifying Observers — who protect the privacy of the vote — are enrolled ahead of time.`,
        then: [
          {
            left: [
              {
                details: `As long as a single Observer works honestly, the privacy of the vote is ensured. This is shown in detail in Step 4.

                No matter what, the accuracy of the vote can still always be verified.

                To enroll, verifying observers need to generate a private key, and take part in a Threshold Key generation process with the election admin to create the corresponding public key for the election.

                Their main job is explained in Step 4, but this shared public key is needed ahead-of-time for voters to encrypt their votes in Step 2.`,
              },
            ],
            right: [
              { html: '<b>Each Observer contributes a share of the unlocking key.</b>' },
              '',
              { image: 'pre-c-key.png', maxWidth: 200 },
              '',
              '',
              {
                html: light(
                  "The Observers ought to have competing interests. A reasonable choice would be one Observer selected by each candidate's political party, plus the election admin.",
                ),
              },
              '',
            ],
          },
        ],
      },
    ],
  },

  {
    group: 'Voting Begins',
    steps: [
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
        name: 'Step 2: Mark & Encrypt Your Vote',
        subheader: `Voter fills out their ballot, which gets immediately encrypted.`,
        then: [
          { left: ['', ''] },
          {
            left: ['', '', { p: 'SIV shows voters a GUI to fill out their ballot:' }],
            right: ['', { react: Ballot }],
          },
          {
            left: [{ html: `SIV adds a unique ${em('Verification #')} before votes are encrypted.` }],
            right: [{ react: VerificationSecret }],
          },
          {
            left: [{ html: `This example results in a ${blue(semibold('plaintext vote'))} like:` }],
            right: ['', { react: Plaintext }],
          },
          { left: ['', '', ''] },
          {
            left: [
              {
                html: `Then the ${blue(semibold('plaintext vote'))} can be sealed, resulting in an ${purple(
                  semibold('encrypted vote'),
                )} that looks like:`,
              },
            ],
            right: ['', { react: EncryptedVote }],
          },
          {
            left: [
              '',
              {
                html: `Encrypted votes ${semibold('can be safely shared')}, without revealing the underlying vote.<br />
                  ${light('The encryption acts like sealing it inside a locked safe.')}`,
              },
            ],
          },
          { left: ['', '', '', ''] },
          // Image about running the SIV Voting software on own computer or 3rd party's server.
          // {
          //   left: [{ html: `This step is completed by using a ${orange(semibold('SIV Sealing Tool'))}:` }],
          //   right: [{ image: 'step-2g-tool-options.png', maxWidth: 462 }],
          // },
          {
            left: [
              {
                html: `SIV creates an Encryption Receipt for each voter, allowing them or 3rd-party auditors to verify that everything worked as intended.<br />
          ${light(`This is automatically stored in the browser's localstorage, and never leaves the device.`)}`,
              },
            ],
            right: ['', { react: EncryptionReceipt }],
          },

          // {
          //   left: [
          //     '',
          //     '',
          //     '',
          //     {
          //       html: `For extra security, this encryption step can be completed while offline (e.g. in airplane mode) and in a sandboxed incognito tab. <br />
          // ${light(
          //   `This protects against the voting software itself being malicious, ensuring it can't possibly store any private vote information.`,
          // )}`,
          //     },
          //   ],
          // },
        ],
      },

      // Step 3
      {
        leftFirst: true,
        name: 'Step 3: Submit Encrypted Vote',
        subheader: 'The voter sends their encrypted vote + Auth Token to the election administrator.',
        then: [
          {
            left: [
              {
                html: `Election admin confirms the ${orange(
                  semibold('Voter Auth Token'),
                )} matches an eligible voter, and hasn't already been used.`,
              },
            ],
            right: ['', '', { react: YourSubmittedBallot }, '', '', '', ''],
          },
          {
            left: [
              {
                details: 'If it passes, the admin adds it to a public list of all votes received so far.',
              },
            ],
            right: ['', { react: AllSubmittedBallots }, '', ''],
          },
          {
            left: [
              {
                html: `The election administrator has no way to know how a voter voted. Still, they can email voters a confirmation that their encrypted vote has been received and accepted.<br />
            ${light(
              `This lets the voter know their job is done. It also alerts the voter in case someone else somehow gained access to their auth token. And it serves as a written receipt that the vote was accepted, to allow for auditing.`,
            )}`,
              },
              '',
            ],
            right: [{ react: SubmissionConfirmation }],
          },
        ],
      },
    ],
  },

  {
    group: 'Voting Period Closes',
    steps: [
      // // Step
      // {
      //   name: 'Voters Identified',
      //   subheader: 'Election administrator can generate a list of everyone who submitted a valid Auth Token.',
      //   then: [
      //     {
      //       left: [
      //         {
      //           html: `${light(`Who voted, but not ${em('how')} anyone voted (which they don't know anyway).`)}`,
      //         },
      //         '',
      //         {
      //           html: `This creates greater trust by showing who the voters are. The public can see they’re real valid voters. Not people voting multiple times, or "dead people", or foreigners, etc., as skeptics worry about.<br />
      //   <br />
      //   ${light(
      //     `This also helps watchdogs pick a random sample of voters to conduct independent audits of the vote’s validity. With individual voters' permission, they can check reported results against voter receipts.`,
      //   )}`,
      //         },
      //         '',
      //       ],
      //       right: [{ react: WhoVoted }, '', ''],
      //     },
      //   ],
      // },

      // Step 4
      {
        leftFirst: true,
        name: 'Step 4: Verifiable Shuffle',
        subheader: 'All the encrypted votes are then anonymized by the Verifying Observers.',
        then: [
          {
            left: [
              {
                html: light("This step de-links voters' identities from the contents of their encrypted votes."),
              },
            ],
          },
          {
            left: [
              '',
              '',
              '',
              '',
              {
                html: `First, the ${orange(
                  semibold('Voter Auth Tokens'),
                )} are removed from the list of all encrypted votes.`,
              },
              '',
            ],
            right: [{ react: RemoveAuthTokens }, '', '', ''],
          },
          {
            left: [
              '',
              '',
              '',
              '',
              '',
              '',
              {
                html: `Observer #1 then shuffles the votes.`,
              },
              '',
            ],
            right: [{ react: ShuffleVotes }],
          },
          {
            left: [
              '',
              {
                details: `This randomizes the order of the votes, like mixing them up in a hat.

                But this alone isn't enough to properly anonymize them, because the encrypted data — the outsides of our metaphorical locked safes — are still distinguishable. Any computer could quickly reconstruct the original list.`,
              },
              '',
              '',
              '',
            ],
          },
          {
            left: [
              '',
              '',
              {
                html: `So, Observer #1 then picks new Randomizer integers for each encrypted field, and ${purple(
                  em(semibold('Re-encrypts')),
                )} the shuffled votes.`,
              },
              '',
              {
                html: `This is like ${semibold(
                  em('painting over'),
                )} the outside of the safes. The vote content is still safely locked within, and the Observer still has no ability to see or modify what's inside.`,
              },
              '',
              {
                html: `${light(
                  `SIV is built upon a homomorphic encryption scheme called <a href="https://en.wikipedia.org/wiki/ElGamal_encryption" target="_blank">ElGamal</a> to enable this re-encryption. The math is equivalent to adding (X * A) + (X * B), or X * (A + B), where A is the Voter's Randomizer and B is the Re-encrypter's. Because the encryption only needs these factors to be randomly chosen integers, there is no impact to the underlying contents.`,
                )}`,
              },
              '',
            ],
            right: ['', { react: Reencryption }],
          },
          {
            left: [
              '',
              '',
              {
                p: 'Now, the shuffled list is cryptographically mixed, with the original Auth Tokens unlinkable.',
              },
              { p: 'Only Observer #1 can possibly know the exact way they shuffled.' },
              {
                p: 'Their shuffled + re-encrypted list is now published publicly.',
              },
              '',
              {
                html: `${light(
                  `Each Observer also provides a ${em(
                    `Zero-Knowledge Proof of a Valid Shuffle`,
                  )}. The SIV Shuffling software generates this for them automatically. This proof allows anyone to verify vote accuracy, even if a Observer is dishonest or compromised.`,
                )}`,
              },
              '',
              '',
              '',
              '',
            ],
          },
          {
            left: [
              {
                p: 'For strong cryptographic privacy, Observer #2 then repeats this same shuffle + re-encryption process, starting with the mixed list from Observer #1.',
              },
              '',
              {
                p: `This way, all of the Observers independently shuffle the encrypted votes, like multiple people shuffling a deck of cards, then handing it off to the next person.`,
              },
              {
                p: `Total privacy is ensured as long as at least a single Observer refuses to share their record of how they shuffled.`,
              },
            ],
            right: ['', '', { image: 'step-4-shuffle.png', maxWidth: 490 }],
          },
        ],
      },

      // Step 5
      {
        name: 'Step 5: Votes Unlocked & Tallied',
        subheader: 'A quorum of Verifying Observers then works together to Unlock the final shuffled list.',
        then: [
          {
            left: [
              {
                html: `This unlocks just the ${blue(semibold('vote contents'))} of the final list, while ${em(
                  'preserving privacy.',
                )}`,
              },
              '',
            ],
            right: [
              '',
              { html: "<b>Each Observer's individual key can partially unlock the final votes.</b>" },
              '',
              { image: 'pre-c-key.png', maxWidth: 200 },
              '',
              '',
              '',
            ],
          },
          {
            left: [
              '',
              '',
              {
                p: `Any voter can Search (Ctrl+F) to find their individual vote, via their Verification #, and see that their vote was counted correctly.`,
              },
              '',
              '',
              { details: `Anyone can tally the final vote count themselves.` },
              '',
              '',
              {
                details: `Only submissions from authenticated voters were accepted, which can be verified with standard Risk-Limiting Audits after the election.`,
              },
            ],
            right: [{ react: Unlocked }, ''],
          },
        ],
      },
    ],
  },
]

export const initStep = groupedSteps[0].steps[0].name
