import { range } from 'lodash-es'
import { Dispatch } from 'react'

import { max_string_length } from './Ballot'
import { Label, TitleDescriptionQuestion } from './Item'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

export const ScoreItem = ({
  description,
  dispatch,
  id = 'vote',
  max_score = 5,
  min_score = -5,
  options,
  question,
  state,
  title,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}): JSX.Element => {
  console.log('state.plaintext:', state.plaintext)

  const scoreOptions = range(min_score, max_score + 1)

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />

      <table className="ml-3">
        {/* Top row Choice labels */}
        <thead>
          <tr>
            <th />

            {scoreOptions.map((x) => (
              <th className="text-[11px] text-center" key={x}>
                {x}
              </th>
            ))}
          </tr>
        </thead>

        {/* List one row for each candidate */}
        <tbody>
          {options.map(({ name, sub, value }) => {
            const val = value || name.slice(0, max_string_length)

            return (
              <tr key={name}>
                <td className="relative pr-4 bottom-0.5">
                  <Label {...{ name, sub }} />
                </td>

                {/* And one column for each ranking option */}
                {scoreOptions.map((score) => (
                  <td className="ml-2" key={score}>
                    <input
                      readOnly
                      checked={state.plaintext[`${id}_${val}`] === `${score}`}
                      className="w-7 h-7 bg-white border-gray-300 border-solid rounded-full appearance-none cursor-pointer hover:bg-blue-100 checked:!bg-[#002868] border-2 checked:border-white/30"
                      type="radio"
                      onClick={() => {
                        const update: Record<string, string> = {}

                        const key = `${id}_${val}`
                        update[key] = `${score}`

                        // Are they deselecting their existing selection?
                        if (state.plaintext[key] === `${score}`) update[key] = 'BLANK'

                        dispatch(update)
                      }}
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      <br />
    </>
  )
}
