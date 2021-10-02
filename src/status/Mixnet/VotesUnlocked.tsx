export const VotesUnlocked = () => {
  return (
    <p>
      Shuffled Votes Unlocked for Tallying
      <style jsx>{`
        p {
          width: 105px;
          text-align: center;
          margin-left: 3rem;
          animation 1s ease fade-in;
        }

        @keyframes fade-in {
          0%,
          90% {
            opacity: 0;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </p>
  )
}
