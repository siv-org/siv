import { Line } from './Line'
import styles from './protocol.module.css'
import { Step as StepObj } from './steps'

export const Step = ({ name, rest }: StepObj, stepIndex: number) => (
  <div key={stepIndex} style={{ background: 'white', padding: '3rem 0' }}>
    <p className={styles.name}>{name}</p>
    <div className="columns">
      <div className="left">{rest.left.map(Line)}</div>
      <div className="right">{rest.right?.map(Line)}</div>
    </div>
    <style jsx>{`
      .columns {
        display: flex;
        padding: 0 15px;
      }

      .left,
      .right {
        flex: 1;
      }

      .left {
        margin-right: 30px;
      }
    `}</style>
  </div>
)
