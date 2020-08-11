import { FormControlLabel, NoSsr, Paper, Radio, RadioGroup } from '@material-ui/core'

import { candidates } from './election-parameters'
import { useVoteContext } from './VoteContext'

export const Ballot = (): JSX.Element => {
  const { dispatch, state } = useVoteContext()

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
        Who should be the next Mayor?
      </p>
      <NoSsr>
        <RadioGroup
          onChange={(event) => dispatch({ vote_for_mayor: event.target.value })}
          style={{ paddingLeft: '1.5rem' }}
          value={state.plaintext.vote_for_mayor}
        >
          {candidates.map((name) => (
            <FormControlLabel control={<Radio color="primary" />} key={name} label={name} value={name} />
          ))}
        </RadioGroup>
      </NoSsr>
    </Paper>
  )
}
