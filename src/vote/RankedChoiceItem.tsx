import { Dispatch, forwardRef, useEffect, useState } from 'react'
import FlipMove from 'react-flip-move'

import { max_string_length } from './Ballot'
import { getOrdinal } from './getOrdinal'
import { Label, TitleDescriptionQuestion } from './Item'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

const WRITE_IN = '$$WRITE_IN$$'

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
  // console.log(state.plaintext)

  const [writeIn, setWriteIn] = useState('')
  const [orderedOptions, setOrderedOptions] = useState(options)

  useEffect(() => {
    // Incorporate write-in handling within sorting if allowed
    const currentOptions = write_in_allowed ? [...options, { name: WRITE_IN, value: writeIn }] : options

    // Sort options by their current rankings
    setOrderedOptions(getSortedOrder(id, currentOptions, state.plaintext))
  }, [options, writeIn, state.plaintext, write_in_allowed])

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />

      <table className="sm:ml-3">
        {/* Top row Choice labels */}
        <thead>
          <tr>
            <th />

            {/* One label for each column of whole table, only visible on big screens */}
            {new Array(rankings_allowed).fill(0).map((_, index) => (
              <th className="font-normal text-[11px] text-center hidden sm:table-cell" key={index}>
                {getOrdinal(index + 1)}
              </th>
            ))}
          </tr>
        </thead>

        {/* List one row for each candidate */}
        <tbody style={{ position: 'relative' }}>
          <FlipMove typeName={null}>
            {orderedOptions.map(({ name, sub, value }) => (
              <OneRow
                isWriteIn={name === WRITE_IN}
                key={name}
                {...{ dispatch, id, name, rankings_allowed, setWriteIn, state, sub, value, writeIn }}
              />
            ))}
          </FlipMove>
        </tbody>
      </table>
      <br />
    </>
  )
}

const OneRow = forwardRef<
  HTMLTableRowElement,
  {
    dispatch: Dispatch<Record<string, string>>
    id: string
    isWriteIn?: boolean
    name: string
    rankings_allowed: number
    setWriteIn: (value: string) => void
    state: State
    sub?: string
    value?: string
    writeIn: string
  }
>(function ({ dispatch, id, isWriteIn, name, rankings_allowed, setWriteIn, state, sub, value, writeIn }, ref) {
  const val = value || (!isWriteIn ? name : writeIn).slice(0, max_string_length)

  const [error, setError] = useState(' ')

  function OneCircle({ index }: { index: number }) {
    return (
      <input
        readOnly
        checked={state.plaintext[`${id}_${index + 1}`] === val}
        className="w-7 h-7 bg-white border-gray-300 border-solid rounded-full appearance-none cursor-pointer sm:hover:bg-blue-100 checked:!bg-[#002868] border-2 checked:border-white/30"
        type="radio"
        onClick={() => {
          const update: Record<string, string> = {}

          for (let i = 1; i <= rankings_allowed; i++) {
            // Fill in all unchecked rankings to prevent encryption holes
            update[`${id}_${i}`] = state.plaintext[`${id}_${i}`] || 'BLANK'

            // Unset any rankings already given to this row
            if (state.plaintext[`${id}_${i}`] === val) update[`${id}_${i}`] = 'BLANK'
          }

          const key = `${id}_${index + 1}`
          update[key] = val || 'BLANK'
          // console.log(key, val)

          // Are they deselecting their existing selection?
          if (state.plaintext[key] === val) update[key] = 'BLANK'

          dispatch(update)
        }}
      />
    )
  }

  return (
    <tr className="flex flex-col sm:table-row" key={name} ref={ref}>
      {/* Display Name */}
      <td className="relative pr-4 sm:bottom-0.5 sm:top-auto top-2">
        {!isWriteIn ? (
          <Label {...{ name: `${name}:`, sub }} />
        ) : (
          // Write-in input field
          <div className="relative">
            <input
              className="w-[10rem] sm:-ml-2.5 px-2 py-1 text-base font-medium text-black/60 border-2 border-black/40 focus:border-black/70 rounded outline-none sm:mb-0 mb-1.5 sm:mt-0 mt-1.5"
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
            {error && (
              <div className="absolute sm:left-0 text-sm text-red-500/70 sm:top-[34px] left-[10.5rem] top-[13px]">
                {error}
              </div>
            )}
          </div>
        )}
        {/* And one column for each ranking option... */}

        {/* On small screens, display them below each name */}
        <div className="flex space-x-1 sm:hidden">
          {new Array(rankings_allowed).fill(0).map((_, index) => (
            <div className="text-center" key={index}>
              <div className="text-[11px]" key={index}>
                {getOrdinal(index + 1)}
              </div>
              <OneCircle {...{ index }} />
            </div>
          ))}
        </div>
      </td>

      {/* On large screens, to the side */}
      {new Array(rankings_allowed).fill(0).map((_, index) => (
        <td className="hidden ml-2 sm:table-cell" key={index}>
          <OneCircle {...{ index }} />
        </td>
      ))}
    </tr>
  )
})
OneRow.displayName = 'OneRow'

export function getSortedOrder(
  keyPrefix: string,
  options: { name: string; value?: string }[],
  selections: Record<string, string>,
): { name: string; value?: string }[] {
  const currentRankings: string[] = []
  const rankedOptions: { name: string; value?: string }[] = []
  const unrankedOptions: { name: string; value?: string }[] = []

  const optionToVal = ({ name, value }: { name: string; value?: string }) => (value || name).slice(0, max_string_length)

  // Build an array of ranked names based on their presence and order in 'selections'
  let index = 1
  let key = `${keyPrefix}_${index}`
  while (key in selections) {
    const name = selections[key]
    if (name !== 'BLANK') currentRankings.push(name)
    index++
    key = `${keyPrefix}_${index}`
  }

  // Divide options into ranked and unranked based on the currentRankings array
  options.forEach((option) => {
    if (currentRankings.includes(optionToVal(option))) {
      rankedOptions.push(option)
    } else {
      unrankedOptions.push(option)
    }
  })

  // Sort the rankedOptions array by the order of names in currentRankings
  rankedOptions.sort((a, b) => currentRankings.indexOf(optionToVal(a)) - currentRankings.indexOf(optionToVal(b)))

  // Return the concatenation of sorted ranked options and the remaining unranked options
  return [...rankedOptions, ...unrankedOptions]
}
