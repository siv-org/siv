import { BottomLabel } from '../Shuffle/BottomLabel'
import { RightArrowIcon } from './RightArrowIcon'
import { UnlockingPile } from './UnlockingPile'

export const VotesUnlocked = ({ step }: { step: number }) => (
  <section className="slide-in">
    <RightArrowIcon />

    <UnlockingPile {...{ step }} />

    {[1, 2].includes(step) && (
      <BottomLabel fadeInFast small>
        <i>Unlocking...</i>
      </BottomLabel>
    )}

    {step === 3 && (
      <BottomLabel fadeInFast small>
        <>
          <span>✓</span> Unlocked for Tallying
        </>
      </BottomLabel>
    )}

    <style jsx>{`
      section {
        display: flex;
        align-items: center;
        position: relative;
      }

      span {
        font-weight: 700;
        color: green;
      }
    `}</style>
  </section>
)
