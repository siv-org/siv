import { useEffect } from 'react'

import { Line } from './Line'
import { useScrollContext } from './ScrollContext'
import { Step as StepType } from './steps'
import { useWindowDimensions } from './useWindowDimensions'

export const Step = ({ leftFirst = false, name, subheader, then }: StepType) => {
  const { dispatch } = useScrollContext()
  const { height, width } = useWindowDimensions()

  useEffect(() => {
    dispatch({ [name]: String((document.getElementById(name) as HTMLElement).offsetTop + 72) })
  }, [height, width])

  return (
    <div id={name} key={name} style={{ background: 'white', padding: '3rem 30px' }}>
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
          justify-content: space-between;
        }

        .left,
        .right {
          width: calc(45vw - 140px);
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

          .left,
          .right {
            width: 45vw;
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

          .left,
          .right {
            width: 100%;
          }

          .right {
            bottom: 0;
          }
        }
      `}</style>
    </div>
  )
}
