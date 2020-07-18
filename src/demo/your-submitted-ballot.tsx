import { useContext } from '../context'
import { voters } from './election-parameters'

export default function YourSubmittedBallot(): JSX.Element {
  const { state } = useContext()

  return (
    <div style={{ padding: '0 6%' }}>
      <code>
        {`{ token: '${voters[0].token}', secret: '${state.encrypted.secret}', vote_for_mayor: '${state.encrypted.vote_for_mayor}' }`}
      </code>
    </div>
  )
}
