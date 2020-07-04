import { DownloadOutlined } from '@ant-design/icons'

import styles from './protocol.module.css'
import signed_receipt from './signed_receipt'

type Filename = string
type MaxWidth = number

type ImageLine = { image: [Filename, MaxWidth] }
type Subsection = { subsection: { header: string; list: string[] } }

type Line = Record<string, string> | Subsection | ImageLine | ''

const blueHex = '#1332fe'
const redHex = '#d0021b'
const purpleHex = '#9013fe'
const greenHex = '#417505'

const colorize = (color: string) => (text: string) => `<span style="color: ${color}; font-weight: 600;">${text}</span>`
const blue = colorize(blueHex)
const red = colorize(redHex)
const purple = colorize(purpleHex)
const green = colorize(greenHex)

const semibold = (text: string) => `<span style="font-weight: 600;">${text}</span>`
const light = (text: string) => `<span style="font-size: 12px; opacity: 0.65;">${text}</span>`
const em = (text: string) => `<em>${text}</em>`
const bold = (text: string) => `<strong>${text}</strong>`

const editable_steps: Line[][] = [
  // Header
  [
    { title: 'Secure Internet Voting (SIV) Protocol Overview' },
    { subtitle: 'Fast, Private, Verifiable' },
    {
      p: `Voting Method with mathematically provable privacy & vote verifiability.
        All over the internet, no installs necessary.`,
    },
  ],

  // Pre-A
  [
    { step_name: 'Pre-Step A: Voter Registration Period' },
    {
      description: `Voting authority collects list of all valid voters,
  using the usual methods (in person, DMV, etc).`,
    },
    { example: '1 million eligible San Francisco voters' },
    { image: ['pre-a-voter-list.png', 450] },
  ],

  // Pre-B
  [
    { step_name: 'Pre-Step B: Shufflers Registered' },
    {
      description: `Shufflers — to ensure the privacy of the vote — need to be
  enrolled ahead of time.`,
    },
    {
      details: `Requirements:
        1. They will need their phone or computer to be online and running a
          special SIV Shuffling program when the voting period closes.
        2. To enroll, they need to generate a private key, and share the
          corresponding public key with the voting authority.

        Their job will be explained in Step 5, but their public keys are needed
        for voters to seal their votes in Step 2.`,
    },
  ],

  // Pre-C
  [{ step_name: 'Pre-Step C: Ballot Finalized' }, { example: '' }, { image: ['pre-c-ballot.png', 400] }],

  // Step 1
  [
    { step_name: 'Step 1: Invitation to Vote' },
    { description: 'Voting authority sends individualized email to all voters.' },
    { image: ['step-1-invitation.png', 533] },
  ],

  // Step 2
  [
    { step_name: 'Step 2: Craft Your Sealed Ballot' },
    {
      description: `Voter fills out their ballot, signing & encrypted (sealing) with their
    Vote Token.`,
    },
    '',
    { p: 'Voter sees a GUI to make it easy to fill out their ballot:' },
    { image: ['step-2a-gui.png', 400] },
    '',
    { details: 'There can be multiple questions, as many as the election requires.' },
    '',
    { p: 'At the end, there\'s a "Verification Note" field — a freeform textbox.' },
    { image: ['step-2c-verification-note.png', 400] },
    '',
    '',
    '',
    { html: `This example results in a plaintext ${blue('marked, unsealed ballot')} like:` },
    {
      html: `
        <code style="color: ${blueHex};">
          {<br />
          &nbsp;&nbsp;vote_for_mayor: ‘london_breed’,<br />
          &nbsp;&nbsp;verification_note: ‘Auto-generated: 76cbd63fa94eba743d5’,<br />
          }
        </code>
      `,
    },
    '',
    '',
    '',
    {
      html: `Then their ${blue('marked ballot')} can be automatically sealed, using their ${red(
        'Vote Token',
      )}, resulting in an encrypted ${purple('sealed ballot')} like:`,
    },
    {
      html: `<code style="color: ${purpleHex}; max-width: 100%; word-break: break-all; font-size: 14px;"><span style="color: ${redHex};">d58e6fab72</span>TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBuZWMgY29tbW9kbyBtYWduY…gdGluY</code>`,
    },
    '',
    {
      subsection: {
        header: 'Sealed Ballots',
        list: [
          `${semibold('can be safely shared')}, without revealing any content of vote.<br />
          ${light('The encryption acts like a sealed envelope.')}`,

          `can ${semibold('only be unlocked by special key')}— explained in final step.`,

          `${semibold(
            `${em('does')} reveal the Vote Token`,
          )} used to sign it. This verifies that the ballot came from a valid voter, and can only be used once.<br />
          ${light('You can think of this like signing the outside of the sealed envelope.')}`,

          `Because it reveals your Vote Token, it’s ${semibold(
            'important not to show your sealed ballot to anyone before you submit it',
          )}. Otherwise they can take your Vote Token to quickly vote in your place before you.<br />
          ${light('If this happens, the Voting Authority can invalidate the Vote Token and generate a new one.')}`,
        ],
      },
    },
    '',
    { html: `This step is completed by using a ${green('SIV Sealing Tool')}:` },
    { image: ['step-2g-tool-options.png', 462] },
    '',
    '',
    '',
    '',
    '',
    '',
    {
      html: `The ${green(
        'SIV Sealing Tool',
      )} can also give you a downloadable signed receipt, allowing 3rd-parties to audit everything worked as intended.<br />
      ${light(
        `This is optional, and provides even more assurance. It can prevent false-claims of improper results.<br />
        (Voter claims the system screwed up their vote, but receipt proves otherwise.)`,
      )}`,
    },
    {
      html: `
        <div style="margin: 3rem;">
          <p style="font-size: 14px"><em>Example:</em></p>
          <code style="max-width: 100%; word-break: break-all; font-size: 11px; opacity: 0.7">${signed_receipt
            .replace(/\t/g, '&nbsp;&nbsp;')
            .replace(/\n/g, '<br />')}
        </code>
        </div>
      `,
    },
  ],

  // Step 3
  [
    { step_name: 'Step 3: Submit Sealed Ballot' },
    {
      html: `<span class="${styles.description}">Voter submits the sealed ballot to Voting Authority.</span><br />
    ${light('The SIV Tool can do this for the Voter automatically.')}`,
    },
    { html: `The sealed ballot is added to a public list of ${bold('all')} Sealed Ballots.` },
    '',
    {
      html: `<code style="max-width: 100%; word-break: break-all; font-size: 14px;">
        1. <span style="color: ${redHex};">d58e6fab72</span><span style="color: ${purpleHex};">TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBuZWMgY29tbW9kbyBtYW…gdGluY</span><br />
        <br />
        …<br />
        <br />
        300,000. <span style="color: ${redHex};">fe34fe7f10</span><span style="color: ${purpleHex};">WU0ZTAwMzZmZmI4ODhkMTY1NDAyOTk0MjY2N2QwZD gKYWJmN2ZhMDczZDgzZmQxMTExNmRiNWJjMDU2YTc3ZDEKZDUzNmzRiYWF…MTAyOW</span><br />
      </code>`,
    },
  ],
]

const image_steps = [
  // 'step-3',
  'step-4',
  'step-5',
  'step-6',
  'step-fin',
]

export default function Protocol(): JSX.Element {
  return (
    <>
      <hr style={{ width: '100%' }} />
      <a href="./Overview.png" style={{ margin: '2rem 0 3rem' }} target="_blank">
        <DownloadOutlined />
        &nbsp;Download single image
      </a>

      <div className={styles.protocol}>
        {editable_steps.map((step, stepIndex) => (
          <div className={styles.step} key={stepIndex}>
            {step.map((line, lineIndex) => {
              // Special handling for breaks
              if (line === '') {
                return <br />
              }

              const type = Object.keys(line)[0]

              // Special handling for images
              if (type === 'image') {
                const filename = (line as ImageLine).image[0]
                const maxWidth = (line as ImageLine).image[1]

                return <img key={lineIndex} src={`./overview/${filename}`} style={{ maxWidth, width: '100%' }} />
              }

              // Specially handling for subsections
              if (type === 'subsection') {
                const { header, list } = (line as Subsection).subsection
                return (
                  <div style={{ margin: '3rem' }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{header}:</p>
                    <ul style={{ fontSize: 7, paddingInlineStart: 13 }}>
                      {list.map((item, listIndex) => (
                        <li key={listIndex} style={{ marginBottom: 15 }}>
                          <span
                            dangerouslySetInnerHTML={{ __html: item }}
                            style={{ fontSize: 14, position: 'relative', top: 2 }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }

              // Otherwise it's text
              const text = Object.values(line)[0] as string

              // Special handling to embed html
              if (type === 'html') {
                return <p dangerouslySetInnerHTML={{ __html: text }} />
              }

              return (
                <p className={styles[type]} key={lineIndex}>
                  {/* label for 'Example:' */}
                  {type === 'example' && <em>Example: </em>}

                  {/* Split on newlines */}
                  {text.split('\n').map((item, key) => (
                    <span key={key}>
                      {item}
                      <br />
                    </span>
                  ))}
                </p>
              )
            })}
          </div>
        ))}
      </div>

      {/* Our static images (converting away from) */}
      {image_steps.map((filename) => (
        <div key={filename} style={{ backgroundColor: '#e5eafd', paddingBottom: '2rem' }}>
          <img src={`./overview/${filename}.png`} width="100%" />
        </div>
      ))}
    </>
  )
}
