import { Paper } from '@material-ui/core'

import { useVoteContext } from './VoteContext'

export function AllSubmittedBallots(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper elevation={3} style={{ opacity: 0.7, overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {state.otherSubmittedVotes.map(({ secret, token, vote_for_mayor }) => (
          <p key={token}>{`{ token: '${token}', secret: ${secret}, vote_for_mayor: ${vote_for_mayor}`}</p>
        ))}
        <p className="fade-in">
          {`{ token: '${state.encrypted.token}', secret: ${state.encrypted.secret}, vote_for_mayor: ${state.encrypted.vote_for_mayor} }`}
        </p>
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
