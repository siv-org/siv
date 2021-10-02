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
            left: quadrants[index][0],
            position: 'absolute',
            top: quadrants[index][1],
          }}
        />
      ))}
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          height: 100px;
          width: 93px;

          background: #fff;
        }

        label {
          position: absolute;
          bottom: -60px;
          line-height: 17px;
          width: 93px;
          text-align: center;

          background: #fff;
        }
      `}</style>
    </div>
  )
}
