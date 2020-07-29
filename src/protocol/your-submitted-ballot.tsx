import { voters } from './election-parameters'
import { useVoteContext } from './VoteContext'

export default function YourSubmittedBallot(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <code style={{ display: 'block', lineHeight: '16px', padding: '0 6%' }}>
      {`{ token: '${voters[0].token}', secret: '${state.encrypted.secret}', vote_for_mayor: '${state.encrypted.vote_for_mayor}' }`}
    </code>
  )
}
