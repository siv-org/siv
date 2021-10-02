import { OneVote } from '../OneVote'
import { quadrants } from './make-paths'

export const StaticPileOfVotes = ({
  index = -1,
  name,
  original,
}: {
  index?: number
  name?: string
  original?: true
}) => {
  return (
    <div>
      {new Array(4).fill(0).map((_, index) => (
        <OneVote
          key={index}
          style={{
            left: quadrants[index][0],
            position: 'absolute',
            top: quadrants[index][1],
          }}
        />
      ))}
      {original && <label>Originally Submitted Votes</label>}
      {name && <label>{name}</label>}
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          height: 100px;
          width: 93px;
          border-top: 1px solid #fff;

          background: #fff;
          z-index: ${100 - index};
        }

        label {
          position: absolute;
          bottom: -60px;
          line-height: 17px;
          width: 93px;
          text-align: center;

          background: #fff;
          z-index: ${100 - index};
        }
      `}</style>
    </div>
  )
}
