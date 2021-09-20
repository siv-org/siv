import { quadrants } from './make-paths'
import { OneVote } from './OneVote'
import { Paths } from './Paths'

export const StaticPileOfVotes = () => {
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
      <Paths />
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          height: 100px;
          width: 100px;
        }
      `}</style>
    </div>
  )
}
