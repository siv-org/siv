import { Paper } from '@material-ui/core'

import { voters } from './election-parameters'

export default function YourSubmittedBallots(): JSX.Element {
  return (
    <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
      <p>
        {'{'} token: <span style={{ color: '#d0021b' }}>&apos;{voters[0].token}&apos;</span> {'}'}
      </p>
    </Paper>
  )
}
