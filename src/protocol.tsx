import { DownloadOutlined } from '@ant-design/icons'

import styles from './protocol.module.css'

type Filename = string
type MaxWidth = number

type Line = Record<string, string> | { image: [Filename, MaxWidth] }

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
]

const image_steps = [
  // 'header',
  // 'pre-a-voter-registration',
  // 'pre-b-shufflers-registered',
  // 'pre-c-ballot-finalized',
  // 'step-1',
  'step-2a',
  'step-2b',
  'step-2c',
  'step-2d',
  'step-2e',
  'step-2f',
  'step-2g',
  'step-2h',
  'step-3',
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
              const type = Object.keys(line)[0]

              // Special handling for images
              if (type === 'image') {
                const filename = line.image[0]
                const maxWidth = line.image[1]

                return <img key={lineIndex} src={`./overview/${filename}`} style={{ maxWidth, width: '100%' }} />
              }

              // Otherwise it's text
              const text = Object.values(line)[0] as string

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
