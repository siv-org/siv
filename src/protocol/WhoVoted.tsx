import { voters } from './election-parameters'
import { Paper } from './Paper'

export const WhoVoted = (): JSX.Element => (
  <Paper>
    <code>
      {voters.map(({ name, token }) => (
        <p key={token}>{`${token}: ${name}`}</p>
      ))}
    </code>
  </Paper>
)
