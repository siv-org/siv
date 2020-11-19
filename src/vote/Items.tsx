import { FormControlLabel, NoSsr, Radio, RadioGroup, TextField } from '@material-ui/core'
import { Dispatch, useState } from 'react'

import { encode } from '../crypto/encode'
import { Paper } from '../protocol/Paper'
import { useBallotDesign } from './useBallotDesign'
import { State } from './useVoteState'

export const Items = ({
  dispatch,
  election_id,
  max_string_length,
  state,
}: {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  max_string_length: number
  state: State
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
        {ballot.map((item) => {
          const id = item.id || 'vote'
          return (
            <div key={item.id}>
              <p className="title">{item.title}</p>
              <p className="description">{item.description}</p>
              <p className="question">{item.question}</p>
              <RadioGroup
                style={{ paddingLeft: '1.5rem' }}
                value={state.plaintext[id]}
                onChange={(event) => dispatch({ [id]: event.target.value })}
              >
                {item.options.map((name) => (
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    key={name}
                    label={name}
                    value={name.slice(0, max_string_length)}
                  />
                ))}
                {item.write_in_allowed && (
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
                          dispatch({ [id]: event.target.value })
                        }}
                      />
                    }
                    style={{ marginTop: 5 }}
                    value={other}
                  />
                )}
              </RadioGroup>
              <br />
            </div>
          )
        })}
      </Paper>
      <style jsx>{`
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10;
          padding: 5px 13px;
        }

        .description,
        .question {
          margin: 13px;
        }
      `}</style>
    </NoSsr>
  )
}
