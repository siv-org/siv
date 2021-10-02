import { UnlockingPile } from './UnlockingPile'

export const VotesUnlocked = ({ step }: { step: number }) => {
  return (
    <section className="slide-in">
      <div className="arrow fade-in" />
      <UnlockingPile {...{ step }} />
      {[1, 2].includes(step) && (
        <label>
          <i>Unlocking...</i>
        </label>
      )}
      {step === 3 && (
        <label className="fade-in-fast">
          <span>✓</span> Unlocked for Tallying
        </label>
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

        p {
          position: absolute;
          top: -40px;
          text-align: center;
          right: -10px;
          width: 110px;
          font-size: 12px;
          font-weight: 600;
        }

        label {
          position: absolute;
          top: 110px;
          line-height: 17px;
          width: 93px;
          right: 0;
          text-align: center;

          font-size: 12px;
        }

        label span {
          font-weight: 700;
          color: green;
        }

        .fade-in-fast {
          animation .5s ease fade-in-fast;
        }

        @keyframes fade-in-fast {
          0%, 50% {
            opacity: 0;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  )
}
