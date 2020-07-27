import { Paper } from '@material-ui/core'

import { useVoteContext } from '../vote-context'
import pickRandomInteger from './crypto/pick-random-integer'
import { voters } from './election-parameters'
import { public_key } from './election-parameters'

export default function AllSubmittedBallots(): JSX.Element {
  const { state } = useVoteContext()
  return (
    <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {voters.slice(1).map(({ token }) => (
          <p key={token}>
            {`{ token: '${token}', secret: '{ sealed_data: ${pickRandomInteger(
              public_key.modulo,
            )}, sealing_factor: ${pickRandomInteger(
              public_key.modulo,
            )} }', vote_for_mayor: '{ sealed_data: ${pickRandomInteger(
              public_key.modulo,
            )}, sealing_factor: ${pickRandomInteger(public_key.modulo)} }'`}
          </p>
        ))}
        <p>
          {`{ token: '${voters[0].token}', secret: '${state.encrypted.secret}', vote_for_mayor: '${state.encrypted.vote_for_mayor}' }`}
        </p>
      </code>
    </Paper>
  )
}
