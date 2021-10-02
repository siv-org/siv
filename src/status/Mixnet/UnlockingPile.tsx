import { useEffect, useState } from 'react'

import { quadrants } from './make-paths'
import { OneVote } from './OneVote'

export const UnlockingPile = ({ index = -1 }: { index?: number; name?: string; original?: true }) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setStep((s) => (s < 2 ? s + 1 : s))
    }, 1000)
  }, [])
  return (
    <div>
      {new Array(4).fill(0).map((_, index) => (
        <OneVote
          key={index}
          step={step}
          style={{
            left: quadrants[index][0],
            position: 'absolute',
            top: quadrants[index][1],
          }}
        />
      ))}
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          height: 100px;
          width: 93px;

          background: #fff;
          z-index: ${100 - index};
        }

        label {
          position: absolute;
          bottom: -60px;
          line-height: 17px;
          width: 93px;
          text-align: center;

          background: #fff;
          z-index: ${100 - index};
        }
      `}</style>
    </div>
  )
}
