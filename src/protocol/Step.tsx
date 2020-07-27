import { Line } from './Line'
import styles from './protocol.module.css'
import { Step as StepObj } from './steps'

export const Step = ({ name, rest }: StepObj, stepIndex: number) => (
  <div key={stepIndex} style={{ background: 'white', padding: '3rem 0' }}>
    <p className={styles.name}>{name}</p>
    <div style={{ padding: '0 15px' }}>{rest.map(Line)}</div>
  </div>
)
