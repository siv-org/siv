import { FormControlLabel, NoSsr, Radio, RadioGroup, TextField } from '@material-ui/core'
import { useState } from 'react'

import { encode } from '../crypto/encode'
import { Paper } from '../protocol/Paper'
import { useBallotDesign } from './useBallotDesign'

export const Question = ({
  election_id,
  max_string_length,
  setVotePlaintext,
  vote_plaintext,
}: {
  election_id?: string
  max_string_length: number
  setVotePlaintext: (plaintext: string) => void
  vote_plaintext: string
}): JSX.Element => {
  const [other, setOther] = useState<string>()
  const [error, setError] = useState(' ')

  const ballot = useBallotDesign(election_id)

  if (!ballot) {
    return <p>Loading ballot...</p>
  }

  return (
    <NoSsr>
      <Paper noFade>
        <p
          style={{
            backgroundColor: '#e6eafb',
            fontWeight: 'bold',
            marginBottom: 10,
            padding: '5px 13px',
          }}
        >
          {ballot.question}
        </p>
        <RadioGroup
          style={{ paddingLeft: '1.5rem' }}
          value={vote_plaintext}
          onChange={(event) => setVotePlaintext(event.target.value)}
        >
          {ballot.choices.map((name) => (
            <FormControlLabel
              control={<Radio color="primary" />}
              key={name}
              label={name}
              value={name.slice(0, max_string_length)}
            />
          ))}
          <FormControlLabel
            control={
              <Radio
                color="primary"
                style={{ bottom: 11, position: 'relative' }}
                onClick={() => document.getElementById('other')?.focus()}
              />
            }
            label={
              <TextField
                error={error !== ' '}
                helperText={error}
                id="other"
                label="Other"
                size="small"
                variant="outlined"
                onChange={(event) => {
                  setError(' ')
                  // Check for too many characters
                  if (event.target.value.length > max_string_length) {
                    return setError('Too many characters')
                  }
                  // Check for invalid characters
                  try {
                    encode(event.target.value)
                  } catch {
                    return setError('Invalid character')
                  }
                  // Passed checks
                  setOther(event.target.value)
                  setVotePlaintext(event.target.value)
                }}
              />
            }
            style={{ marginTop: 5 }}
            value={other}
          />
        </RadioGroup>
      </Paper>
    </NoSsr>
  )
}
