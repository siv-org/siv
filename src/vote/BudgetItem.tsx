import { Dispatch, useEffect, useState } from 'react'
import { Switch } from 'src/admin/BallotDesign/Switch'

import { Label, TitleDescriptionQuestion } from './Item'
import { Item as ItemType } from './storeElectionInfo'
import { State } from './vote-state'

export const BudgetItem = ({
  budget_available = 0,
  description,
  dispatch,
  id = 'vote',
  options,
  question,
  state,
  title,
  toggleable_2_label,
  toggleable_label,
}: ItemType & {
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  state: State
}): JSX.Element => {
  // console.log('state.plaintext:', state.plaintext)
  const [showToggleables, setShowToggleables] = useState(true)
  const [showToggleable2, setShowToggleable2] = useState(true)

  const sum = options.reduce((sum, { value }) => {
    const amount = state.plaintext[`${id}_${value}`]
    if (amount === 'BLANK') return sum

    const number = Number(amount)
    if (isNaN(number)) return sum
    if (number < 0) return sum

    return sum + number
  }, 0)

  const remaining = budget_available - sum

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

      {/* Budget Available */}
      <div className="my-3 text-center">
        <div
          className={`inline-block px-1 border-2 ${
            remaining >= 0 ? 'border-green-600' : 'border-red-600'
          } border-solid rounded`}
        >
          Budget Available: ${remaining} of ${budget_available}
        </div>
        {remaining < 0 && <div className="px-1 pt-1 font-semibold text-red-500">You{"'"}ve exceeded the budget.</div>}
      </div>

      {toggleable_label && (
        <div className="inline-block px-2 pb-3 border border-solid rounded-lg sm:ml-3 border-black/20">
          <Switch
            checked={showToggleables}
            label={`Show ${toggleable_label}`}
            labelClassName="!bottom-0 top-px !cursor-default ml-1.5"
            onClick={() => setShowToggleables(!showToggleables)}
          />
        </div>
      )}

      {toggleable_2_label && (
        <div className="inline-block px-2 pb-3 mt-1.5 border border-solid rounded-lg sm:ml-3 border-black/20">
          <Switch
            checked={showToggleable2}
            label={`Show ${toggleable_2_label}`}
            labelClassName="!bottom-0 top-px !cursor-default ml-1.5"
            onClick={() => setShowToggleable2(!showToggleable2)}
          />
        </div>
      )}

      <table className="sm:ml-3">
        {/* List one row for each candidate */}
        <tbody>
          {options.map(({ name, sub, toggleable, toggleable_2, value }) => {
            const val = value || name

            const current = state.plaintext[`${id}_${val}`] || ''

            return (
              <tr key={name}>
                <td className="relative pr-4 bottom-0.5">
                  <Label {...{ name, sub }} />
                  {showToggleables && toggleable && (
                    <div className="text-xs">
                      {toggleable_label ? toggleable_label + ': ' : ''}
                      {toggleable.slice(0, -3)}
                    </div>
                  )}
                  {showToggleable2 && toggleable_2 && (
                    <div className="px-1 text-xs border border-solid rounded">
                      {toggleable_2.type && (
                        <div>
                          Type:{' '}
                          <span
                            className={`px-1 rounded ${
                              { Docs: 'bg-purple-200', Implementation: 'bg-yellow-200', Protocol: 'bg-blue-300' }[
                                toggleable_2.type
                              ]
                            }`}
                          >
                            {toggleable_2.type}
                          </span>
                        </div>
                      )}
                      {toggleable_2.like && (
                        <div className="mt-1 whitespace-break-spaces">
                          <div className="font-semibold">In favor:</div>
                          {toggleable_2.like}
                        </div>
                      )}
                      {toggleable_2.dislike && (
                        <div className="mt-1 whitespace-break-spaces">
                          <div className="font-semibold ">Against:</div>
                          {toggleable_2.dislike}
                        </div>
                      )}
                    </div>
                  )}
                </td>

                {/* And one column for each ranking option */}
                <td className="relative ml-2">
                  <div className="absolute pt-1.5 text-xl left-2 opacity-50">$</div>
                  <input
                    className="w-24 h-10 px-1 text-lg text-right bg-white border-2 border-gray-300 border-solid rounded appearance-none cursor-pointer hover:border-blue-600"
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
