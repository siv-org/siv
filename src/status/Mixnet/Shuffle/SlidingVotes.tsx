import { BottomLabel } from './BottomLabel'
import { ShuffleIcon } from './ShuffleIcon'
import { StaticPileOfVotes } from './StaticPileOfVotes'

export const SlidingVotes = ({ index, name }: { index: number; name: string }) => {
  return (
    <section>
      <ShuffleIcon fadeIn />
      <StaticPileOfVotes {...{ index }} />
      <BottomLabel {...{ name }} fadeIn />
      <style jsx>{`
        section {
          display: flex;
          align-items: center;
          animation: 1s linear slide-in;
          z-index: ${100 - index};

          position: relative;
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
