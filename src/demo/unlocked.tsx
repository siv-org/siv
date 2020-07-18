import { Paper } from '@material-ui/core'

import { useContext } from '../context'
import { candidates, voters } from './election-parameters'
import { generateSecretID } from './secret-id'

export default function Unlocked(): JSX.Element {
  const { state } = useContext()
  return (
    <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {voters.slice(1).map(({ token }) => (
          <p key={token}>{`{ secret: '${generateSecretID()}', vote_for_mayor: '${
            candidates[Math.floor(Math.random() * candidates.length)]
          }' }'`}</p>
        ))}
        <p>{`{ secret: '${state.plaintext.secret}', vote_for_mayor: '${state.plaintext.vote_for_mayor}' }`}</p>
      </code>
    </Paper>
  )
}
