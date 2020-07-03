import { DownloadOutlined } from '@ant-design/icons'

import styles from './protocol.module.css'

type Line = Record<string, string> | { image: [string, number] }
type Step = Line[]

const header: Step = [
  { title: 'Secure Internet Voting (SIV) Protocol Overview' },
  { subtitle: 'Fast, Private, Verifiable' },
  {
    p: `Voting Method with mathematically provable privacy & vote verifiability.
All over the internet, no installs necessary.`,
  },
]

const preA: Step = [
  { section_name: 'Pre-Step A: Voter Registration Period' },
  {
    description: `Voting authority collects list of all valid voters,
  using the usual methods (in person, DMV, etc).`,
  },
  { example: '1 million eligible San Francisco voters' },
  { image: ['pre-a-voter-list.png', 450] },
]

const steps = [
  // 'header',
  // 'pre-a-voter-registration',
  'pre-b-shufflers-registered',
  'pre-c-ballot-finalized',
  'step-1',
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
        {[header, preA].map((step, stepIndex) => (
          <div className={styles.step} key={stepIndex}>
            {step.map((line, lineIndex) => {
              const type = Object.keys(line)[0]

              if (type === 'image') {
                const filename = line.image[0]
                const width = line.image[1]

                return <img src={`./overview/${filename}`} width={width} />
              }

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
      {steps.map((filename) => (
        <div key={filename} style={{ backgroundColor: '#e5eafd', paddingBottom: '2rem' }}>
          <img src={`./overview/${filename}.png`} width="100%" />
        </div>
      ))}
    </>
  )
}
