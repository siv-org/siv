import { useElectionInfo } from '../use-election-info'
import { ReplayButton } from './debug/ReplayButton'
import { FadeAndSlideInCSS } from './FadeAndSlideInCSS'
import { AfterShuffle } from './Shuffle/AfterShuffle'
import { RandomPathsCSS } from './Shuffle/RandomPathsCSS'
import { ShufflingVotes } from './Shuffle/ShufflingVotes'
import { SlidingVotes } from './Shuffle/SlidingVotes'
import { StaticPileOfVotes } from './Shuffle/StaticPileOfVotes'
import { VotesUnlocked } from './Unlock/VotesUnlocked'
import { useStepCounter } from './useStepCounter'

export const debug = false
const initStep = 0

export const Mixnet = () => {
  const { observers = [] } = useElectionInfo()

  const maxStep = observers.length * 3 + 4

  const { startInterval, step } = useStepCounter(initStep, !observers.length ? 0 : maxStep)

  const initUnlockingStep = observers.length * 3 + 1

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

        {step >= initUnlockingStep && <VotesUnlocked step={step - initUnlockingStep} />}
      </main>
      <ReplayButton {...{ maxStep, step }} onClick={startInterval} />
      <RandomPathsCSS />
      <FadeAndSlideInCSS />
      <style jsx>{`
        section {
          margin-top: 2rem;
          margin-bottom: 8rem;
        }

        h3 {
          margin-bottom: 5px;
        }

        p {
          margin-top: 0px;
          font-size: 13px;
          font-style: italic;
          opacity: 0.7;
        }

        a {
          font-weight: 600;
        }

        main {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 5rem;
          padding-top: 3rem;
        }
      `}</style>
    </section>
  )
}
