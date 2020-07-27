import { useEffect } from 'react'

import { useContext } from '../context'
import { Line } from './Line'
import { Step as StepType } from './steps'

export const Step = ({ leftFirst = false, name, subheader, then }: StepType) => {
  const { dispatch } = useContext()

  useEffect(() => {
    dispatch({ yOffset: { [name]: String((document.getElementById(name) as HTMLElement).offsetTop) } })
  }, [])

  return (
    <div id={name} key={name} style={{ background: 'white', padding: '3rem 15px' }}>
      <p className="step-name">{name}</p>
      {subheader && <p className="subheader">{subheader}</p>}
      {then.map(({ left, right }, index) => (
        <div className={`columns ${leftFirst ? 'leftFirst' : ''}`} key={index}>
          <div className="left">{left.map(Line)}</div>
          <div className="right">{right?.map(Line)}</div>
        </div>
      ))}

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
          max-width: calc(48vw - 140px);
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

        .right {
          position: relative;
          bottom: 40px;
        }

        /* Sidebar disappears */
        @media (max-width: 1030px) {
          .subheader {
            max-width: 48vw;
          }
        }

        /* Single column for small screens */
        @media (max-width: 750px) {
          .subheader {
            max-width: 100vw;
          }

          .columns {
            flex-direction: column-reverse;
          }

          .columns.leftFirst {
            flex-direction: column;
          }

          .left {
            margin-right: 0;
          }

          .right {
            bottom: 0;
          }
        }
      `}</style>
    </div>
  )
}
