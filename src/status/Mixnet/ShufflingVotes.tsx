import { OneVote } from './OneVote'

export const ShufflingVotes = ({ name }: { name?: string }) => {
  return (
    <section>
      <img src="/vote/shuffle.png" />
      <div>
        {new Array(4).fill(0).map((_, index) => (
          <OneVote
            key={index}
            style={{
              animationDuration: '1s',
              animationName: `path-${Math.floor(Math.random() * 10)}`,
              animationTimingFunction: 'ease',
              position: 'absolute',
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
          width: 100px;
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
