import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { NoSsr } from 'src/_shared/NoSsr'
import { useEffect } from 'react'

import { candidates } from './election-parameters'
import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

export const Ballot = (): JSX.Element => {
  const { dispatch, state } = useVoteContext()

  useEffect(() => dispatch({ mayor_vote: candidates[1] }), [])

  return (
    <Paper marginBottom noFade>
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
          style={{ paddingLeft: '1.5rem' }}
          value={state.plaintext.mayor_vote}
          onChange={(event) => dispatch({ mayor_vote: event.target.value })}
        >
          {candidates.map((name) => (
            <FormControlLabel control={<Radio color="primary" />} key={name} label={name} value={name} />
          ))}
        </RadioGroup>
      </NoSsr>
    </Paper>
  )
}
