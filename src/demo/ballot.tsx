import { FormControlLabel, Paper, Radio, RadioGroup } from '@material-ui/core'

import { useContext } from '../context'

export default function BallotWrapper(enabled?: boolean) {
  return function Ballot(): JSX.Element {
    const { dispatch, state } = useContext()

    return (
      <Paper elevation={3} style={{ marginBottom: 30, padding: '0.5rem 1.5rem' }}>
        <p
          style={{
            backgroundColor: '#e6eafb',
            fontWeight: 'bold',
            marginBottom: 10,
            padding: '5px 13px',
          }}
        >
          Who should become the next Mayor of San Francisco?
        </p>
        <RadioGroup
          onChange={(event) => dispatch({ vote_for_mayor: event.target.value })}
          style={{ paddingLeft: '1.5rem' }}
          value={enabled ? state.vote_for_mayor : ''}
        >
          {['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim'].map((name) => (
            <FormControlLabel control={<Radio color="primary" />} key={name} label={name} value={name} />
          ))}
        </RadioGroup>
      </Paper>
    )
  }
}
