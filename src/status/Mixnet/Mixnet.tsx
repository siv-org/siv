import { useEffect, useState } from 'react'

import { useElectionInfo } from '../use-election-info'
import { AfterShuffle } from './AfterShuffle'
import { RandomPathsCSS } from './RandomPathsCSS'
import { ReplayButton } from './ReplayButton'
import { ShufflingVotes } from './ShufflingVotes'
import { SlidingVotes } from './SlidingVotes'
import { StaticPileOfVotes } from './StaticPileofVotes'
import { StepLabel } from './StepLabel'

export const Mixnet = () => {
  const { observers = [] } = useElectionInfo()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setStep((v) => (v < observers.length * 3 ? v + 1 : v))
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
                {step === index * 3 + 1 && <SlidingVotes name={o} {...{ index }} />}
                {step === index * 3 + 2 && <ShufflingVotes name={o} />}
                {step >= index * 3 + 3 && <AfterShuffle name={o} />}
              </>
            )}
          </div>
        ))}
      </main>
      <style jsx>{`
        section {
          margin-bottom: 5rem;
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
