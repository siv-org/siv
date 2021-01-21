import { FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core'
import { Dispatch, useState } from 'react'

import { encode } from '../crypto/encode'
import { Item as ItemType } from './useElectionInfo'
import { State } from './vote-state'

export const Item = ({
  description,
  dispatch,
  id = 'vote',
  max_string_length,
  options,
  question,
  state,
  title,
  write_in_allowed,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  max_string_length: number
  state: State
}): JSX.Element => {
  const [other, setOther] = useState<string>()
  const [error, setError] = useState(' ')

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />
      <RadioGroup
        style={{ paddingLeft: '1.5rem' }}
        value={state.plaintext[id] || ''}
        onChange={(event) => dispatch({ [id]: event.target.value })}
      >
        {options.map(({ name, sub, value }) => (
          <FormControlLabel
            control={<Radio color="primary" />}
            key={name}
            label={<Label {...{ name, sub }} />}
            value={value || name.slice(0, max_string_length)}
            onClick={() => {
              // Deselect if already selected
              if (state.plaintext[id] === (value || name.slice(0, max_string_length))) {
                dispatch({ [id]: '' })
              }
            }}
          />
        ))}
        {write_in_allowed && (
          <FormControlLabel
            control={
              <Radio
                color="primary"
                style={{ bottom: 11, position: 'relative' }}
                onClick={() => document.getElementById(`${id}-other`)?.focus()}
              />
            }
            label={
              <TextField
                error={error !== ' '}
                helperText={error}
                id={`${id}-other`}
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
    </>
  )
}

export const Label = ({ name, sub }: { name: string; sub?: string }) => (
  <div>
    {name}
    {sub && <p>{sub}</p>}
    <style jsx>{`
      div {
        position: relative;
        margin: 8px 0;
      }

      p {
        margin: 0 0 0px;
        font-size: 12px;
        opacity: 0.85;
      }
    `}</style>
  </div>
)

export const TitleDescriptionQuestion = ({
  description,
  question,
  title,
}: {
  description?: string
  question?: string
  title?: string
}) => (
  <>
    <p className="title">{title}</p>
    {description && <p className="description">{description}</p>}
    {question && <p className="question">{question}</p>}
    <style jsx>{`
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        padding: 5px 13px;
        white-space: pre-line;
      }

      .description,
      .question {
        margin: 13px;
        white-space: pre-wrap;
      }
    `}</style>
  </>
)
