import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

export function AllSubmittedBallots(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper>
      <code>
        {state.otherSubmittedVotes.map(({ auth, mayor_vote }) => (
          <p key={auth}>{`{ auth: '${auth}', mayor_vote: ${mayor_vote}`}</p>
        ))}
        <p className="fade-in">{`{ auth: '${state.encrypted.auth}', mayor_vote: ${state.encrypted.mayor_vote} }`}</p>
      </code>
      <style jsx>{`
        .fade-in {
          opacity: 0;
          animation: 4s infinite fadein;
        }
        @keyframes fadein {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Paper>
  )
}
