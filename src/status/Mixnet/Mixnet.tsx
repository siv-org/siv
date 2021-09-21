import { useEffect, useState } from 'react'

import { RandomPathsCSS } from './RandomPathsCSS'
import { ReplayButton } from './ReplayButton'
import { ShufflingVotes } from './ShufflingVotes'
import { SlidingVotes } from './SlidingVotes'
import { StaticPileOfVotes } from './StaticPileofVotes'
import { StepLabel } from './StepLabel'

export const Mixnet = () => {
  const observers = ['SIV Server', 'David Ernst', 'Ariana Ivan']
  const [step, setStep] = useState(2)

  useEffect(() => {
    setInterval(() => {
      setStep((v) => (v < 2 ? v + 1 : v))
    }, 1000)
  }, [])

  return (
    <section>
      <h3>Anonymization Mixnet</h3>
      <ReplayButton onClick={() => setStep(0)} />
      <StepLabel {...{ step }} />
      <RandomPathsCSS />
      <main>
        <StaticPileOfVotes original />

        {observers.map((o, index) => (
          <div key={index}>
            {step > index * 3 && (
              <>
                {step % 3 === 1 && <SlidingVotes name={o} {...{ index }} />}
                {step % 3 === 2 && <ShufflingVotes name={o} />}
                {step % 3 === 0 && <StaticPileOfVotes name={o} />}
              </>
            )}
          </div>
        ))}
      </main>
      <style jsx>{`
        section {
          margin-bottom: 3rem;
        }

        main {
          display: flex;
          align-items: center;
          position: relative;
        }
      `}</style>
    </section>
  )
}
