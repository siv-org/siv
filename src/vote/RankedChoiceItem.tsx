import { Dispatch } from 'react'

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
  rankings_allowed = 4,
  state,
  title,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  rankings_allowed?: number
  state: State
}): JSX.Element => {
  // console.log(state.plaintext)

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />

      {/* Top row Choice labels */}
      <div className="flex ml-24">
        {new Array(rankings_allowed).fill(0).map((_, index) => (
          <div className="text-center w-11" key={index}>
            {getOrdinal(index + 1)}
          </div>
        ))}
      </div>

      <div className="pl-4">
        {/* List one row for each candidate */}
        {options.map(({ name, sub, value }) => {
          const val = value || name.slice(0, max_string_length)

          return (
            <div className="flex" key={name}>
              <Label {...{ name, sub }} />

              {/* And one column for each ranking option */}
              {new Array(rankings_allowed).fill(0).map((_, index) => (
                <div className="ml-2" key={index}>
                  <input
                    readOnly
                    checked={state.plaintext[`${id}_${index + 1}`] === val}
                    className="w-7 h-7 bg-white border-gray-300 border-solid rounded-full appearance-none cursor-pointer hover:bg-blue-100 checked:!bg-[#002868] checked:border-white/30"
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
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <br />
    </>
  )
}
