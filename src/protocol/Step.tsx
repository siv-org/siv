import { Line } from './Line'
import { Step as StepObj } from './steps'

export const Step = ({ name, subheader, then }: StepObj, stepIndex: number) => (
  <div key={stepIndex} style={{ background: 'white', padding: '3rem 15px' }}>
    <p className="step-name">{name}</p>
    <p className="subheader">{subheader}</p>
    <div className="columns">
      <div className="left">{then.left.map(Line)}</div>
      <div className="right">{then.right?.map(Line)}</div>
    </div>
    <style jsx>{`
      .step-name {
        margin: 0;
        color: #000c;
        font-size: 16px;
        font-weight: 700;
      }

      .subheader {
        margin-top: 10px;
        font-size: 15px;
        font-weight: 700;
        max-width: 600px;
      }

      .columns {
        display: flex;
      }

      .left,
      .right {
        flex: 1;
      }

      .left {
        margin-right: 30px;
      }

      /* Single column for small screens */
      @media (max-width: 750px) {
        .columns {
          flex-direction: column-reverse;
        }

        .left {
          margin-right: 0;
        }
      }
    `}</style>
  </div>
)
