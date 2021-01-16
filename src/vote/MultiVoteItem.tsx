import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import { Dispatch, useState } from 'react'

import { Item as ItemType } from './useElectionInfo'
import { State } from './vote-state'

export const MultiVoteItem = ({
  description,
  // dispatch,
  // id = 'vote',
  max_string_length,
  multiple_votes_allowed,
  options,
  question,
  // state,
  title,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  max_string_length: number
  multiple_votes_allowed: number
  state: State
}): JSX.Element => {
  const [selected, setState] = useState(
    options.reduce(
      (acc: Record<string, boolean>, opt) => ({ ...acc, [opt.value || opt.name.slice(0, max_string_length)]: false }),
      {},
    ),
  )

  const num_selected = Object.values(selected).filter((v) => v).length

  return (
    <>
      <p className="title">{title}</p>
      <p className="description">{description}</p>
      <p className="question">{question}</p>
      <p className="remaining">Remaining votes: {multiple_votes_allowed - num_selected}</p>
      <FormGroup style={{ paddingLeft: '1.5rem' }}>
        {options.map(({ name, sub, value }) => {
          const val = value || name.slice(0, max_string_length)

          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected[val]}
                  color="primary"
                  onChange={(event) => {
                    // If we've already used all our votes
                    if (num_selected >= multiple_votes_allowed) {
                      // Prevent them from using another
                      if (event.target.checked) return
                    }
                    setState({ ...selected, [event.target.name]: event.target.checked })
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
          margin-bottom: 10;
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
