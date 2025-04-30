import { Dispatch, Fragment, useEffect, useRef, useState } from 'react'
import { Switch } from 'src/admin/BallotDesign/Switch'

import { Label, TitleDescriptionQuestion } from './Item'
import { Linkify } from './Linkify'
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
  const [showToggleables, setShowToggleables] = useState(false)
  const [showToggleable2, setShowToggleable2] = useState(false)
  const itemRefs = useRef<HTMLTableRowElement[]>([])
  const headerRef = useRef<HTMLDivElement>(null)

  /** Find the option currently visible */
  function findCurrentTopItemInView() {
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    return itemRefs.current.find((ref) => {
      const rect = ref.getBoundingClientRect()
      return rect.top >= headerHeight
    })
  }
  function scrollToCurrentTopItemInView(currentTopItem?: HTMLTableRowElement) {
    if (!currentTopItem) return
    if (currentTopItem === itemRefs.current[0]) return
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    // Ensure the component updates before adjusting the scroll
    setTimeout(() => {
      const offsetTop = currentTopItem.getBoundingClientRect().top - headerHeight
      window.scrollTo({ top: window.scrollY + offsetTop })
    }, 0)
  }

  const sum = options.reduce((sum, { name, value }) => {
    const amount = state.plaintext[`${id}_${value || name}`]
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

      <div className="sticky top-0 z-10 bg-white" ref={headerRef}>
        {/* Budget Available */}
        <div className="py-3 text-center">
          <div
            className={`inline-block px-1 border-2 ${
              remaining >= 0 ? 'border-green-600' : 'border-red-600'
            } border-solid rounded`}
          >
            Budget Available: ${remaining} of ${budget_available}
          </div>
          {remaining < 0 && <div className="px-1 pt-1 font-semibold text-red-500">You{"'"}ve exceeded the budget.</div>}
        </div>

        {(toggleable_label || toggleable_2_label) && (
          <div className="sm:ml-3">
            <div className="text-xs opacity-60">Show:</div>
            <div className="flex justify-between py-1.5">
              {toggleable_label && (
                <div
                  className="inline-block px-2 border border-solid rounded-lg cursor-pointer border-black/20"
                  onClick={() => {
                    const currentTopItem = findCurrentTopItemInView()
                    setShowToggleables(!showToggleables)
                    scrollToCurrentTopItemInView(currentTopItem)
                  }}
                >
                  <Switch checked={showToggleables} label="" onClick={() => {}} />
                  <span className="text-xs">{toggleable_label}</span>
                </div>
              )}

              {toggleable_2_label && (
                <div
                  className="inline-block px-2 pb-3 border border-solid rounded-lg cursor-pointer sm:ml-3 border-black/20"
                  onClick={() => {
                    const currentTopItem = findCurrentTopItemInView()
                    setShowToggleable2(!showToggleable2)
                    scrollToCurrentTopItemInView(currentTopItem)
                  }}
                >
                  <Switch checked={showToggleable2} label="" onClick={() => {}} />
                  <span className="text-xs">{toggleable_2_label}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <table className="sm:ml-3">
        {/* List one row for each candidate */}
        <tbody>
          {options.map(({ name, sub, toggleable, toggleable_2, value }, index) => {
            const val = value || name

            const current = state.plaintext[`${id}_${val}`] || ''

            return (
              <Fragment key={val}>
                <tr key={name} ref={(el: HTMLTableRowElement) => (itemRefs.current[index] = el)}>
                  <td className="relative pr-4 bottom-0.5 pt-6">
                    <Label {...{ name, sub }} number={index + 1} />
                    {showToggleables && toggleable && (
                      <div className="text-xs">
                        {toggleable_label ? toggleable_label + ': ' : ''}
                        {toggleable.slice(0, -3)}
                      </div>
                    )}
                  </td>

                  {/* Column for input box */}
                  <td className="relative ml-2">
                    <div className="absolute pt-1.5 text-xl left-2 opacity-50">$</div>
                    <input
                      className="w-20 h-10 px-1 text-lg text-right bg-white border-2 border-gray-300 border-solid rounded appearance-none cursor-pointer hover:border-blue-600"
                      onChange={(event) => {
                        const update: Record<string, string> = {}

                        const change = event.target.value
                        const key = `${id}_${val}`
                        update[key] = `${change}`

                        // Are they deselecting their existing selection?
                        if (!change) update[key] = 'BLANK'

                        dispatch(update)
                      }}
                      value={current === 'BLANK' ? '' : current}
                    />
                  </td>
                </tr>

                {showToggleable2 && toggleable_2 && (
                  <tr className="!pb-10">
                    <td className="px-2 pt-2 pb-4 text-xs border border-solid rounded border-black/30" colSpan={2}>
                      {toggleable_2.type && (
                        <div>
                          Type:{' '}
                          <span
                            className={`px-1 rounded ${
                              {
                                Docs: 'bg-purple-200',
                                Implementation: 'bg-yellow-200',
                                Protocol: 'bg-blue-600 text-white/90',
                              }[toggleable_2.type]
                            }`}
                          >
                            {toggleable_2.type}
                          </span>
                        </div>
                      )}
                      <Linkify>
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
                      </Linkify>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      <br />
    </>
  )
}
