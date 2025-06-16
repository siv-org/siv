import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { Dispatch, useState } from 'react'

import { max_string_length } from './Ballot'
import { Linkify } from './Linkify'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

export const Item = ({
  description,
  dispatch,
  id = 'vote',
  options,
  question,
  state,
  title,
  write_in_allowed,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}): JSX.Element => {
  const [other, setOther] = useState<string>()
  const [error, setError] = useState(' ')

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />
      <RadioGroup
        className="ml-1 sm:ml-6"
        onChange={(event) => dispatch({ [id]: event.target.value })}
        value={state.plaintext[id] || ''}
      >
        {options.map(({ name, sub, value }) => (
          <FormControlLabel
            control={<Radio color="primary" />}
            key={name}
            label={<Label {...{ name, sub }} nameClassName="!font-normal" />}
            onClick={() => {
              // Deselect if already selected
              if (state.plaintext[id] === (value || name.slice(0, max_string_length))) {
                dispatch({ [id]: '' })
              }
            }}
            value={value || name.slice(0, max_string_length)}
          />
        ))}
        {write_in_allowed && (
          <FormControlLabel
            control={
              <Radio
                color="primary"
                onClick={() => document.getElementById(`${id}-other`)?.focus()}
                style={{ bottom: 11, position: 'relative' }}
              />
            }
            label={
              <TextField
                error={error !== ' '}
                helperText={error}
                id={`${id}-other`}
                label="Other"
                onChange={(event) => {
                  setError(' ')
                  // Check for too many characters
                  if (event.target.value.length > max_string_length) {
                    return setError('Too many characters')
                  }
                  // Check for invalid characters
                  try {
                    new TextEncoder().encode(event.target.value)
                  } catch {
                    return setError('Invalid character')
                  }
                  // Passed checks
                  setOther(event.target.value)
                  dispatch({ [id]: event.target.value })
                }}
                size="small"
                variant="outlined"
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

export const Label = ({
  name,
  nameClassName,
  number,
  sub,
}: {
  name: string
  nameClassName?: string
  number?: number
  sub?: string
}) => (
  <div className="my-2">
    <Linkify>
      <span className={`font-bold opacity-95 ${nameClassName}`}>
        {number && <span className="text-xs font-light opacity-50">{number}. </span>}
        {name}
      </span>
      {sub && <p className="m-0 text-[12px] opacity-75">{sub}</p>}
    </Linkify>
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
    <Linkify>
      {title && <p className="title sm:px-[13px] py-[5px] mb-2.5">{title}</p>}
      {description && <p className="whitespace-pre-wrap sm:m-[13px] mb-0">{description}</p>}
      {question && <p className="whitespace-pre-wrap sm:m-[13px]">{question}</p>}
    </Linkify>
    <style jsx>{`
      .title {
        font-size: 16px;
        font-weight: bold;
        white-space: pre-line;
      }
    `}</style>
  </>
)
