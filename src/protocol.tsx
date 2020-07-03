import { DownloadOutlined } from '@ant-design/icons'

import styles from './protocol.module.css'

const header = [
  { title: 'Secure Internet Voting (SIV) Protocol Overview' },
  { subtitle: 'Fast, Private, Verifiable' },
  {
    p: `Voting Method with mathematically provable privacy & vote verifiability.
All over the internet, no installs necessary.`,
  },
]

const steps = [
  // 'header',
  'pre-a-voter-registration',
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
        {header.map((line, index) => {
          const type = Object.keys(line)[0]
          const text = Object.values(line)[0]

          return (
            <p className={styles[type]} key={index}>
              {text}
            </p>
          )
        })}
      </div>
      {steps.map((filename) => (
        <div key={filename} style={{ backgroundColor: '#e5eafd', paddingBottom: '2rem' }}>
          <img src={`./overview/${filename}.png`} width="100%" />
        </div>
      ))}
    </>
  )
}
