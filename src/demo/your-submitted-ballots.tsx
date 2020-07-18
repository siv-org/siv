import { Paper } from '@material-ui/core'

import { voters } from './election-parameters'

export default function AllSubmittedBallots(): JSX.Element {
  return (
    <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
      {voters.slice(1).map(({ token }) => (
        <p key={token}>
          {'{'} token: <span style={{ color: '#d0021b' }}>&apos;{token}&apos;</span> {'}'}
        </p>
      ))}
      <p>
        {'{'} token: <span style={{ color: '#d0021b' }}>&apos;{voters[0].token}&apos;</span> {'}'}
      </p>
    </Paper>
  )
}
