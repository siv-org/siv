import { Paper } from '@material-ui/core'

import { voters } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function RemoveVoteTokens(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper elevation={3} style={{ opacity: 0.7, overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {state.otherSubmittedVotes.map(({ random, token }) => (
          <p key={token}>
            {`{`} <span className="fade-out">token: &apos;{token}&apos;,</span> secret: &apos;{'{'} sealed_data:{' '}
            {random[0].toString()}, sealing_factor: {random[1].toString()} {'}'}&apos;, vote_for_mayor: &apos;{'{'}{' '}
            sealed_data: {random[2].toString()}, sealing_factor: ${random[3].toString()} {`}`}
          </p>
        ))}
        <p>
          {`{`} <span className="fade-out">token: &apos;{voters[0].token}&apos;,</span> secret: &apos;
          {state.encrypted.secret}
          &apos;, vote_for_mayor: &apos;
          {state.encrypted.vote_for_mayor}&apos; {`}`}
        </p>
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
