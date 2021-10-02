import { BottomLabel } from '../Shuffle/BottomLabel'
import { UnlockingPile } from './UnlockingPile'

export const VotesUnlocked = ({ step }: { step: number }) => {
  return (
    <section className="slide-in">
      <div className="arrow fade-in" />

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

        .arrow {
          margin: 0 19px 0 9px;
          width: 28px;
          height: 28px;
          border: 3px solid;
          border-color: black transparent transparent black;
          transform: rotate(135deg);
        }

        span {
          font-weight: 700;
          color: green;
        }
      `}</style>
    </section>
  )
}
