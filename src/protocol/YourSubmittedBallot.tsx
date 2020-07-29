import { voters } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function YourSubmittedBallot(): JSX.Element {
  const { secret, vote_for_mayor } = useVoteContext().state.encrypted

  return (
    <code style={{ display: 'block', lineHeight: '16px', padding: '0 6%' }}>
      {`{`} token: <span style={{ color: '#e67e37', fontWeight: 700 }}>&apos;{voters[0].token}&apos;</span>, secret:
      &apos;{secret}
      &apos;, vote_for_mayor: &apos;
      {vote_for_mayor}&apos; {`}`}
    </code>
  )
}
