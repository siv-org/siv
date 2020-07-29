import { Paper } from '@material-ui/core'

import { voters } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function AllSubmittedBallots(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper elevation={3} style={{ opacity: 0.7, overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {state.otherSubmittedVotes.map(({ random, token }) => (
          <p key={token}>
            {`{ token: '${token}', secret: '{ sealed_data: ${random[0]}, sealing_factor: ${random[1]} }', vote_for_mayor: '{ sealed_data: ${random[2]}, sealing_factor: ${random[3]} }'`}
          </p>
        ))}
        <p className="fade-in">
          {`{ token: '${voters[0].token}', secret: '${state.encrypted.secret}', vote_for_mayor: '${state.encrypted.vote_for_mayor}' }`}
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
