import { StaticPileOfVotes } from './StaticPileofVotes'

export const AfterShuffle = ({ name }: { name: string }) => {
  return (
    <section>
      <img src="/vote/shuffle.png" />
      <StaticPileOfVotes />
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
