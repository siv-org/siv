import { Dispatch, useEffect } from 'react'

import { Label, TitleDescriptionQuestion } from './Item'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

export const BudgetItem = ({
  description,
  dispatch,
  id = 'vote',
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
        {/* List one row for each candidate */}
        <tbody>
          {options.map(({ name, sub, value }) => {
            const val = value || name

            const current = state.plaintext[`${id}_${val}`] || ''

            return (
              <tr key={name}>
                <td className="relative pr-4 bottom-0.5">
                  <Label {...{ name, sub }} />
                </td>

                {/* And one column for each ranking option */}
                <td className="ml-2">
                  <input
                    className="w-24 h-10 px-1 text-lg bg-white border-2 border-gray-300 border-solid rounded appearance-none cursor-pointer hover:border-blue-600"
                    value={current === 'BLANK' ? '' : current}
                    onChange={(event) => {
                      const update: Record<string, string> = {}

                      const change = event.target.value
                      const key = `${id}_${val}`
                      update[key] = `${change}`

                      // Are they deselecting their existing selection?
                      if (!change) update[key] = 'BLANK'

                      dispatch(update)
                    }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <br />
    </>
  )
}
