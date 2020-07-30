import { Paper } from '@material-ui/core'

import { useVoteContext } from './VoteContext'

export function ShuffleVotes(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <Paper elevation={3} style={{ marginTop: 30, opacity: 0.7, overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {state.otherSubmittedVotes.map(({ random, token }) => (
          <p key={token}>
            {`{`} secret: &apos;{'{'} sealed_data: {random[0].toString()}, sealing_factor: {random[1].toString()} {'}'}
            &apos;, vote_for_mayor: &apos;{'{'} sealed_data: {random[2].toString()}, sealing_factor: $
            {random[3].toString()} {`}`}
          </p>
        ))}
        <p>
          {`{`} secret: &apos;
          {state.encrypted.secret}
          &apos;, vote_for_mayor: &apos;
          {state.encrypted.vote_for_mayor}&apos; {`}`}
        </p>
      </code>
    </Paper>
  )
}
