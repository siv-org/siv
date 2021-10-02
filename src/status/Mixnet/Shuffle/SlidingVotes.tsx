import { ShuffleIcon } from './ShuffleIcon'
import { StaticPileOfVotes } from './StaticPileOfVotes'

export const SlidingVotes = ({ index, name }: { index: number; name: string }) => {
  return (
    <section>
      <ShuffleIcon fadeIn />
      <StaticPileOfVotes {...{ index }} />
      {name && <label className="fade-in">{name}</label>}
      <style jsx>{`
        section {
          display: flex;
          align-items: center;
          animation: 1s linear slide-in;
          z-index: ${100 - index};

          position: relative;
        }

        label {
          position: absolute;
          top: 110px;
          line-height: 17px;
          width: 93px;
          right: 0;
          text-align: center;

          background: #fff;
        }

        @keyframes slide-in {
          0% {
            transform: translateX(-100%);
          }
          65%,
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  )
}
