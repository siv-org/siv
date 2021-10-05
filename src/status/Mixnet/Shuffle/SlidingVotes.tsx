import { BottomLabel } from './BottomLabel'
import { ShuffleIcon } from './ShuffleIcon'
import { StaticPileOfVotes } from './StaticPileOfVotes'

export const SlidingVotes = ({ index, name }: { index: number; name: string }) => {
  return (
    <section className="slide-in">
      <ShuffleIcon fadeIn />
      <StaticPileOfVotes {...{ index }} />
      <BottomLabel {...{ name }} fadeIn />
      <style jsx>{`
        section {
          display: flex;
          align-items: center;
          z-index: ${100 - index};

          position: relative;
        }
      `}</style>
    </section>
  )
}
