import { OneVote } from './OneVote'
import { Paths } from './Paths'

export const PileOfVotes = () => {
  return (
    <div>
      {new Array(4).fill(0).map((_, index) => (
        <OneVote
          key={index}
          style={{
            animationDuration: '1s',
            animationName: `move-${Math.floor(Math.random() * 10)}`,
            animationTimingFunction: 'ease',
            position: 'absolute',
          }}
        />
      ))}
      <Paths />
      <style jsx>{`
        div {
          display: flex;
          margin-bottom: 3rem;
          position: relative;
          height: 100px;
          width: 100px;
        }
      `}</style>
    </div>
  )
}
