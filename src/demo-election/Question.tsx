import { FormControlLabel, NoSsr, Radio, RadioGroup, TextField } from '@material-ui/core'
import { useState } from 'react'

import { Paper } from '../protocol/Paper'

const ballot = {
  allow_write_in: true,
  choices: ['Chocolate', 'Cookie Dough', 'Mint', 'Strawberry', 'Vanilla'],
  question: 'What is the best flavor of ice cream?',
}

export const Question = ({
  plaintext,
  setPlaintext,
}: {
  plaintext: string
  setPlaintext: (plaintext: string) => void
}): JSX.Element => {
  const [other, setOther] = useState<string>()
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
          onChange={(event) => setPlaintext(event.target.value)}
          style={{ paddingLeft: '1.5rem' }}
          value={plaintext}
        >
          {ballot.choices.map((name) => (
            <FormControlLabel control={<Radio color="primary" />} key={name} label={name} value={name} />
          ))}
          <FormControlLabel
            control={<Radio color="primary" />}
            label={
              <TextField
                id="other"
                label="Other"
                onChange={(event) => {
                  setOther(event.target.value)
                  setPlaintext(event.target.value)
                }}
                size="small"
                variant="outlined"
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
