import { Milestone } from './Milestone'
import styles from './protocol.module.css'
import { Step } from './Step'
import { steps } from './steps'

export const Content = () => (
  <div id="protocol" style={{ backgroundColor: '#e5eafd', flex: 1, height: '100vh', overflowY: 'scroll' }}>
    {/* Header */}
    <div style={{ backgroundColor: 'white', padding: '10px 16px' }}>
      <p style={{ fontSize: 21, fontWeight: 700, marginBottom: 0 }}>Secure Internet Voting (SIV) Protocol Overview</p>
      <p style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>Fast, Private, Verifiable</p>
      <p className={styles.p}>
        Voting Method with mathematically provable privacy &amp; vote verifiability. <br />
        No installs necessary.
      </p>
    </div>

    {/* Main steps */}
    {steps.map((item) => (typeof item === 'string' ? Milestone(item) : Step(item)))}

    {/* Fin */}
    <div style={{ textAlign: 'center' }}>
      <img src={`./protocol/step-fin.png`} style={{ maxWidth: 600, width: '100%' }} />
    </div>
  </div>
)
