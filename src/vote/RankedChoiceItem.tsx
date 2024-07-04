import { Dispatch, useState } from 'react'

import { max_string_length } from './Ballot'
import { getOrdinal } from './getOrdinal'
import { Label, TitleDescriptionQuestion } from './Item'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

export const RankedChoiceItem = ({
  description,
  dispatch,
  id = 'vote',
  options,
  question,
  rankings_allowed,
  state,
  title,
  write_in_allowed,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  rankings_allowed: number
  state: State
}): JSX.Element => {
  console.log(state.plaintext)

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />

      <table className="ml-3">
        {/* Top row Choice labels */}
        <thead>
          <tr>
            <th />

            {new Array(rankings_allowed).fill(0).map((_, index) => (
              <th className="text-[11px] text-center" key={index}>
                {getOrdinal(index + 1)}
              </th>
            ))}
          </tr>
        </thead>

        {/* List one row for each candidate */}
        <tbody>
          {options.map(({ name, sub, value }) => (
            <OneRow key={name} {...{ dispatch, id, name, rankings_allowed, state, sub, value }} />
          ))}

          {write_in_allowed && <OneRow isWriteIn name={'Write-in'} {...{ dispatch, id, rankings_allowed, state }} />}
        </tbody>
      </table>

      <br />
    </>
  )
}

function OneRow({
  dispatch,
  id,
  isWriteIn,
  name,
  rankings_allowed,
  state,
  sub,
  value,
}: {
  dispatch: Dispatch<Record<string, string>>
  id: string
  isWriteIn?: boolean
  name: string
  rankings_allowed: number
  state: State
  sub?: string
  value?: string
}) {
  const [writeIn, setWriteIn] = useState<string>('')
  const val = value || (!isWriteIn ? name : writeIn).slice(0, max_string_length)

  const [error, setError] = useState(' ')

  return (
    <tr key={name}>
      {/* Display Name */}
      <td className="relative pr-4 bottom-0.5">
        {!isWriteIn ? (
          <Label {...{ name, sub }} />
        ) : (
          // Write-in input field
          <div className="relative">
            <input
              className="w-[10rem] -ml-2.5 px-2 py-1 text-base font-medium text-black/60 border-2 border-black/40 focus:border-black/70 rounded outline-none"
              id="write-in"
              placeholder="Write-in"
              value={writeIn}
              onChange={(event) => {
                setError(' ')

                // When write-in changes, unset any matching selections
                const update: Record<string, string> = {}
                for (let i = 1; i <= rankings_allowed; i++) {
                  if (state.plaintext[`${id}_${i}`] === writeIn) {
                    update[`${id}_${i}`] = 'BLANK'
                  }
                }
                dispatch(update)

                // Check for too many characters
                if (event.target.value.length > max_string_length) return setError('Too many characters')

                // Check for invalid characters
                try {
                  new TextEncoder().encode(event.target.value)
                } catch {
                  return setError('Invalid character')
                }

                setWriteIn(event.target.value)
              }}
            />
            {error && <div className="absolute left-0 text-sm text-red-500/70 bottom-[-18px]">{error}</div>}
          </div>
        )}
      </td>

      {/* And one column for each ranking option */}
      {new Array(rankings_allowed).fill(0).map((_, index) => (
        <td className="ml-2 align-top" key={index}>
          <input
            readOnly
            checked={state.plaintext[`${id}_${index + 1}`] === val}
            className="w-7 h-7 bg-white border-gray-300 border-solid rounded-full appearance-none cursor-pointer hover:bg-blue-100 checked:!bg-[#002868] border-2 checked:border-white/30"
            type="radio"
            onClick={() => {
              const update: Record<string, string> = {}

              // Fill in all unchecked rankings to prevent encryption holes
              for (let i = 1; i <= rankings_allowed; i++) {
                update[`${id}_${i}`] = state.plaintext[`${id}_${i}`] || 'BLANK'
              }

              const key = `${id}_${index + 1}`
              update[key] = val
              // console.log(key, val)

              // Are they deselecting their existing selection?
              if (state.plaintext[key] === val) update[key] = 'BLANK'

              dispatch(update)
            }}
          />
        </td>
      ))}
    </tr>
  )
}
