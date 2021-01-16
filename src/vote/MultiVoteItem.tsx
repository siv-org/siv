import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import { Dispatch, useEffect, useState } from 'react'

import { Item as ItemType } from './useElectionInfo'
import { State } from './vote-state'

export const MultiVoteItem = ({
  description,
  dispatch,
  id = 'vote',
  max_string_length,
  multiple_votes_allowed,
  options,
  question,
  title,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  max_string_length: number
  multiple_votes_allowed: number
  state: State
}): JSX.Element => {
  const [selected, setState] = useState(new Set<string>())

  // Store changes in localstorage state
  useEffect(() => {
    const selections = [...selected].sort()

    // Pad selections array up to `multiple_votes_allowed`, to prevent encryption holes
    for (let i = selected.size; i < multiple_votes_allowed; i++) {
      selections.push('BLANK')
    }

    // Convert selections array to object like:
    // { [item.id_1]: selection_1, [item.id_2]: selection_2 }
    const obj = selections.reduce((acc, choice, index) => ({ ...acc, [`${id}_${index + 1}`]: choice }), {})

    dispatch(obj)
  }, [selected.size])

  return (
    <>
      <p className="title">{title}</p>
      {description && <p className="description">{description}</p>}
      {question && <p className="question">{question}</p>}
      <p className="remaining">Remaining votes: {multiple_votes_allowed - selected.size}</p>
      <FormGroup style={{ paddingLeft: '1.5rem' }}>
        {options.map(({ name, sub, value }) => {
          const val = value || name.slice(0, max_string_length)

          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.has(val)}
                  color="primary"
                  onChange={(event) => {
                    // If they're trying to add
                    if (event.target.checked) {
                      // Allow if they still have votes remaining
                      if (selected.size < multiple_votes_allowed) {
                        setState(new Set([...selected, val]))
                      }
                    } else {
                      // Otherwise remove
                      const newSet = new Set([...selected])
                      newSet.delete(val)
                      setState(newSet)
                    }
                  }}
                />
              }
              key={name}
              label={<Label {...{ name, sub }} />}
              name={val}
            />
          )
        })}
      </FormGroup>
      <br />
      <style jsx>{`
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          padding: 5px 13px;
          white-space: pre;
        }

        .description,
        .question,
        .remaining {
          margin: 13px;
        }
      `}</style>
    </>
  )
}

function Label({ name, sub }: { name: string; sub?: string }) {
  return (
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
}
