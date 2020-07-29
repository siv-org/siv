import { voters } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function YourSubmittedBallot(): JSX.Element {
  const { secret, vote_for_mayor } = useVoteContext().state.encrypted

  return (
    <code style={{ display: 'block', lineHeight: '16px', padding: '0 6%' }}>
      {`{ token: '${voters[0].token}', secret: '${secret}', vote_for_mayor: '${vote_for_mayor}' }`}
    </code>
  )
}
