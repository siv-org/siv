import { ShuffleIcon } from './ShuffleIcon'
import { StaticPileOfVotes } from './StaticPileOfVotes'

export const AfterShuffle = ({ index, name }: { index: number; name: string }) => {
  return (
    <section>
      <ShuffleIcon />
      <p>
        Shuffled {index + 1} time{index > 0 ? 's' : ''}
      </p>
      <StaticPileOfVotes />
      {name && <label>{name}</label>}
      <style jsx>{`
        section {
          display: flex;
          align-items: center;
          position: relative;
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
        }
      `}</style>
    </section>
  )
}
