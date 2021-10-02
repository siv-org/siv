import { OneVote } from '../OneVote'
import { quadrants } from './make-paths'

export const ShufflingVotes = ({ name }: { name?: string }) => {
  return (
    <section>
      <img src="/vote/shuffle.png" />
      <div>
        {new Array(5).fill(0).map((_, start) => (
          <OneVote
            key={start}
            style={{
              animationDuration: '1s',
              animationName: `path-${start % 4}-${Math.floor(Math.random() * 10)}`,
              animationTimingFunction: 'ease',
              left: 0,
              position: 'absolute',
              top: 0,
              transform: `translate(${quadrants[start % 4][0]}%, ${quadrants[start % 4][1]}%)`,
            }}
          />
        ))}
      </div>
      {name && <label>{name}</label>}
      <style jsx>{`
        section {
          display: flex;
          align-items: center;
          position: relative;
        }

        img {
          width: 40px;
          margin: 0 15px;
        }

        div {
          display: flex;
          position: relative;
          height: 100px;
          width: 93px;
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
      `}</style>
    </section>
  )
}
