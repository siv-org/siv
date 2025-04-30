import { OneVote } from '../OneVote'
import { BottomLabel } from './BottomLabel'
import { quadrants } from './make-paths'

export const StaticPileOfVotes = ({ index = -1, original }: { index?: number; original?: true }) => {
  return (
    <div>
      <div className="pile">
        {new Array(4).fill(0).map((_, vIndex) => (
          <OneVote
            key={vIndex}
            style={{
              left: 0,
              position: 'absolute',
              top: 0,
              transform: `translate(${quadrants[vIndex][0]}%, ${quadrants[vIndex][1]}%)`,
            }}
          />
        ))}
        {original && <BottomLabel name="Originally Submitted Votes" small />}
        <style jsx>{`
          .pile {
            display: flex;
            position: relative;
            height: 100px;
            width: 93px;
            border-top: 1px solid #fff;

            background: #fff;
            z-index: ${100 - index};
          }
        `}</style>
      </div>
    </div>
  )
}
