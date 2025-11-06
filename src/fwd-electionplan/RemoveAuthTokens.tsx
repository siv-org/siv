import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

export function RemoveAuthTokens(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper>
      <code>
        {[...state.otherSubmittedVotes, state.encrypted].map(({ auth, mayor_vote }) => (
          <p key={auth}>
            {`{`} <span className="fade-out">auth: &apos;{auth}&apos;,</span> mayor_vote: {mayor_vote} {`}`}
          </p>
        ))}
      </code>
      <style jsx>{`
        .fade-out {
          opacity: 0;
          animation: 4s infinite fadeout;
        }
        @keyframes fadeout {
          0% {
            opacity: 1;
          }
          25% {
            opacity: 1;
          }
          40% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </Paper>
  )
}
