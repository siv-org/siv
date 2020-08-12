import { useVoteContext } from './VoteContext'

export function YourSubmittedBallot(): JSX.Element {
  const { mayor_vote, token, verification } = useVoteContext().state.encrypted

  return (
    <code style={{ display: 'block', lineHeight: '16px', padding: '0 6%' }}>
      {`{`} token: <span style={{ color: '#e67e37', fontWeight: 700 }}>&apos;{token}&apos;</span>, mayor_vote:{' '}
      {mayor_vote}, verification: {verification} {`}`}
    </code>
  )
}
