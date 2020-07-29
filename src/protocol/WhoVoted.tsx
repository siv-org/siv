import { Paper } from '@material-ui/core'

import { voters } from './election-parameters'

export const WhoVoted = (): JSX.Element => (
  <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
    <code>
      {voters.map(({ name, token }) => (
        <p key={token}>{`${token}: ${name}`}</p>
      ))}
    </code>
  </Paper>
)
