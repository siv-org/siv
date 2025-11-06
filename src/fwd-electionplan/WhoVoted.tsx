import { voters } from './election-parameters'
import { Paper } from './Paper'

export const WhoVoted = (): JSX.Element => (
  <Paper>
    <code>
      {voters.map(({ auth, name }) => (
        <p key={auth}>{`${auth}: ${name}`}</p>
      ))}
    </code>
  </Paper>
)
