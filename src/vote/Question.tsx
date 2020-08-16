import { FormControlLabel, NoSsr, Radio, RadioGroup, TextField } from '@material-ui/core'
import { useState } from 'react'

import { encode } from '../crypto/encode'
import { Paper } from '../protocol/Paper'

const ballot = {
  allow_write_in: true,
  choices: ['Chocolate', 'Cookie Dough', 'Mint', 'Strawberry', 'Vanilla'],
  question: 'What is the best flavor of ice cream?',
}

export const Question = ({
  max_string_length,
  plaintext,
  setPlaintext,
}: {
  max_string_length: number
  plaintext: string
  setPlaintext: (plaintext: string) => void
}): JSX.Element => {
  const [other, setOther] = useState<string>()
  const [error, setError] = useState(' ')
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
          value={plaintext}
          onChange={(event) => setPlaintext(event.target.value)}
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
                  if (event.target.value.length > 10) {
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
                  setPlaintext(event.target.value)
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
