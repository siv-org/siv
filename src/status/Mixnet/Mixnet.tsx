import { useEffect, useState } from 'react'

import { useElectionInfo } from '../use-election-info'
import { AfterShuffle } from './AfterShuffle'
import { RandomPathsCSS } from './RandomPathsCSS'
import { ReplayButton } from './ReplayButton'
import { ShufflingVotes } from './ShufflingVotes'
import { SlidingVotes } from './SlidingVotes'
import { StaticPileOfVotes } from './StaticPileOfVotes'
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
      <p>
        This animation illustrates how the encrypted votes were anonymized by the Election&apos;s Verifying Observers
        before being unlocked. For more, see{' '}
        <a href="../protocol#4" target="_blank">
          SIV Protocol Step 4: Verifiable Shuffle
        </a>
        .
      </p>
      <main>
        <StaticPileOfVotes original />

        {observers.map((o, index) => (
          <div key={index}>
            {step > index * 3 && (
              <>
                {step === index * 3 + 1 && <SlidingVotes name={o} {...{ index }} />}
                {step === index * 3 + 2 && <ShufflingVotes name={o} />}
                {step >= index * 3 + 3 && <AfterShuffle index={index} name={o} />}
              </>
            )}
          </div>
        ))}
      </main>
      <ReplayButton onClick={() => setStep(0)} />
      <StepLabel {...{ step }} />
      <RandomPathsCSS />
      <style jsx>{`
        section {
          margin-bottom: 1rem;
        }

        main {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 5rem;
          padding-top: 2rem;
        }

        a {
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}
