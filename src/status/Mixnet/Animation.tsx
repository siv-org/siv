import { useElectionInfo } from '../use-election-info'
import { ReplayButton } from './debug/ReplayButton'
import { AfterShuffle } from './Shuffle/AfterShuffle'
import { ShufflingVotes } from './Shuffle/ShufflingVotes'
import { SlidingVotes } from './Shuffle/SlidingVotes'
import { StaticPileOfVotes } from './Shuffle/StaticPileOfVotes'
import { VotesUnlocked } from './Unlock/VotesUnlocked'
import { useStepCounter } from './useStepCounter'

const initStep = 0

export const Animation = () => {
  const { observers = [] } = useElectionInfo()

  const maxStep = observers.length * 3 + 4

  const { startInterval, step } = useStepCounter(initStep, !observers.length ? 0 : maxStep)

  const initUnlockingStep = observers.length * 3 + 1
  return (
    <>
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

      <style jsx>{`
        main {
          display: flex;
          align-items: center;
          position: relative;
          padding-bottom: 5rem;
          padding-top: 3rem;

          overflow-x: scroll;
        }
      `}</style>
    </>
  )
}
