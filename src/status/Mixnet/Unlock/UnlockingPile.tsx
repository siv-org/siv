import { OneVote } from '../OneVote'
import { quadrants } from '../Shuffle/make-paths'

export const UnlockingPile = ({ step }: { step: number }) => {
  return (
    <div>
      {new Array(4).fill(0).map((_, index) => (
        <OneVote
          key={index}
          step={step}
          style={{
            left: 0,
            position: 'absolute',
            top: 0,
            transform: `translate(${quadrants[index][0]}%, ${quadrants[index][1]}%)`,
          }}
        />
      ))}
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          height: 100px;
          width: 93px;
          border-top: 1px solid #fff;

          background: #fff;
        }
      `}</style>
    </div>
  )
}
