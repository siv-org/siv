import { UnlockingPile } from './UnlockingPile'

export const VotesUnlocked = () => {
  return (
    <section>
      <div className="arrow"></div>
      <UnlockingPile />
      <label>Unlocked for Tallying</label>
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

        @keyframes fade-in {
          0%,
          90% {
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
