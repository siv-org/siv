import { useVoteContext } from './VoteContext'

export function YourSubmittedBallot(): JSX.Element {
  const { secret, token, vote_for_mayor } = useVoteContext().state.encrypted

  return (
    <code style={{ display: 'block', lineHeight: '16px', padding: '0 6%' }}>
      {`{`} token: <span style={{ color: '#e67e37', fontWeight: 700 }}>&apos;{token}&apos;</span>, secret: {secret},
      vote_for_mayor: {vote_for_mayor} {`}`}
    </code>
  )
}
