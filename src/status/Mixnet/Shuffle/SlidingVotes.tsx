import { StaticPileOfVotes } from '../StaticPileOfVotes'

export const SlidingVotes = ({ index, name }: { index: number; name: string }) => {
  return (
    <section>
      <img className="fade-in" src="/vote/shuffle.png" />
      <StaticPileOfVotes {...{ index }} />
      {name && <label className="fade-in">{name}</label>}
      <style jsx>{`
        section {
          display: flex;
          align-items: center;
          animation: 1s linear slide-in;
          z-index: ${100 - index};
          
          position: relative;
        }

        .fade-in {
          animation 1s ease fade-in;
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

          background: #fff;
        }

        @keyframes slide-in {
          0% {
            transform: translateX(-100%);
          }
          65%, 100% {
            transform: translateX(0%);
          }
        }

        @keyframes fade-in {
          0%, 90% {
            opacity: 0;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  )
}
