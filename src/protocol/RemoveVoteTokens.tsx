import { Paper } from '@material-ui/core'

import { useVoteContext } from './VoteContext'

export function RemoveVoteTokens(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper elevation={3} style={{ opacity: 0.7, overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {[...state.otherSubmittedVotes, state.encrypted].map(({ secret, token, vote_for_mayor }) => (
          <p key={token}>
            {`{`} <span className="fade-out">token: &apos;{token}&apos;,</span> secret: {secret}, vote_for_mayor:{' '}
            {vote_for_mayor}
            {`}`}
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
