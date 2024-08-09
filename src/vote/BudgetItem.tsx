import { range } from 'lodash-es'
import { Dispatch, useEffect } from 'react'
import { default_max_score, default_min_score } from 'src/admin/BallotDesign/Wizard'

import { Label, TitleDescriptionQuestion } from './Item'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

export const BudgetItem = ({
  description,
  dispatch,
  id = 'vote',
  max_score = default_max_score,
  min_score = default_min_score,
  options,
  question,
  state,
  title,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}): JSX.Element => {
  // console.log('state.plaintext:', state.plaintext)

  const scoreOptions = range(min_score, max_score + 1)

  // On first load, set all scores to 'BLANK'
  useEffect(() => {
    const update: Record<string, string> = {}
    options.forEach(({ name, value }) => {
      const val = value || name
      const key = `${id}_${val}`

      // Stop if we already have a stored value
      if (state.plaintext[key]) return

      update[key] = `BLANK`
    })
    dispatch(update)
  }, [])

  return (
    <>
      <TitleDescriptionQuestion {...{ description, question, title }} />

      <table className="sm:ml-3">
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
            const val = value || name

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
