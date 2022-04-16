import { useEffect, useRef } from 'react'
import smoothscroll from 'smoothscroll-polyfill'

import { ReplayButton } from './debug/ReplayButton'
import { FadeAndSlideInCSS } from './FadeAndSlideInCSS'
import { AfterShuffle } from './Shuffle/AfterShuffle'
import { RandomPathsCSS } from './Shuffle/RandomPathsCSS'
import { ShufflingVotes } from './Shuffle/ShufflingVotes'
import { SlidingVotes } from './Shuffle/SlidingVotes'
import { StaticPileOfVotes } from './Shuffle/StaticPileOfVotes'
import { VotesUnlocked } from './Unlock/VotesUnlocked'
import { useStepCounter } from './useStepCounter'

const initStep = 0

export const Animation = ({ observers, protocolPage }: { observers: string[]; protocolPage?: boolean }) => {
  const el = useRef<HTMLDivElement>(null)

  const maxStep = observers.length * 3 + 4
  const initUnlockingStep = observers.length * 3 + 1

  // Turn on smoothscroll polyfill (for Safari)
  useEffect(() => {
    smoothscroll.polyfill()
  })
  function scrollToEnd(step: number) {
    if (step % 3 === 0) {
      setTimeout(() => {
        el.current?.scrollBy({ behavior: 'smooth', left: el.current?.scrollWidth })
      }, 50)
    }
  }

  const { startInterval, step } = useStepCounter(initStep, !observers.length ? 0 : maxStep, scrollToEnd)

  // If on /protocol, auto-loop forever
  useEffect(() => {
    if (protocolPage && step === initUnlockingStep) {
      setTimeout(startInterval, 1 * 1000)
    }
  }, [step])

  return (
    <>
      <main ref={el}>
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

        {step >= initUnlockingStep && !protocolPage && <VotesUnlocked step={step - initUnlockingStep} />}

        {/* Right padding spacer */}
        <div style={{ opacity: 0 }}>abc</div>
      </main>
      <ReplayButton {...{ maxStep, step }} onClick={startInterval} />

      <RandomPathsCSS />
      <FadeAndSlideInCSS />

      <style jsx>{`
        main {
          display: flex;
          align-items: center;
          position: relative;
          padding-bottom: 5rem;
          padding-top: 3rem;
          overflow-x: auto;
        }
      `}</style>
    </>
  )
}
