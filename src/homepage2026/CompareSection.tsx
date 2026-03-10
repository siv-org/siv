import { useCallback, useEffect, useReducer, useState } from 'react'

import type { OpenedModalIndex } from './compare/compare-data'

import { methods, tableData } from './compare/compare-data'
import { getScore } from './compare/compare-utils'
import { CompareModal } from './compare/CompareModal'
import { CompareTable } from './compare/CompareTable'
import { ScrollReveal } from './ScrollReveal'

export function CompareSection() {
  const [bountyEnabled, toggleBounty] = useReducer((t: boolean) => !t, true)
  const [isDescriptionShown, toggleDescription] = useReducer((t: boolean) => !t, true)
  const [isCollapsed, toggleCollapsed] = useReducer((t: boolean) => !t, true)
  const [openedModalIndex, setOpenedModalIndex] = useState<OpenedModalIndex>(null)

  function getModalContent(index: OpenedModalIndex) {
    if (!index) return null
    const [catIndex, rowIndex, colIndex] = index

    const cat = tableData[catIndex]
    const row = cat.rows[rowIndex]
    const scores = bountyEnabled ? row.scores_with_bounty || row.scores : row.scores
    const score = scores[colIndex]

    return {
      advantages: score[1]?.adv || '',
      d_name: row.d_name,
      disadvantages: score[1]?.disadv || '',
      title: `${methods[colIndex]} – ${row.d_name}: ${getScore(score)} / 10`,
    }
  }

  const modalContent = getModalContent(openedModalIndex)

  const closeModal = () => setOpenedModalIndex(null)

  const goRight = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      if (colIndex + 1 >= methods.length) return current
      return [catIndex, rowIndex, colIndex + 1]
    })
  }, [])

  const goLeft = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      if (colIndex === 0) return current
      return [catIndex, rowIndex, colIndex - 1]
    })
  }, [])

  const goDown = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      const nextRowIndex = rowIndex + 1

      if (nextRowIndex < tableData[catIndex].rows.length) return [catIndex, nextRowIndex, colIndex]
      if (catIndex + 1 < tableData.length) return [catIndex + 1, 0, colIndex]

      return current
    })
  }, [])

  const goUp = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      const previousRowIndex = rowIndex - 1

      if (previousRowIndex >= 0) return [catIndex, previousRowIndex, colIndex]
      if (catIndex - 1 >= 0) {
        const prevCatLastRowIndex = tableData[catIndex - 1].rows.length - 1
        return [catIndex - 1, prevCatLastRowIndex, colIndex]
      }

      return current
    })
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!openedModalIndex) return

      if (event.key.startsWith('Arrow')) event.preventDefault()

      if (event.key === 'ArrowRight') goRight()
      if (event.key === 'ArrowLeft') goLeft()
      if (event.key === 'ArrowDown') goDown()
      if (event.key === 'ArrowUp') goUp()
    },
    [openedModalIndex, goDown, goLeft, goRight, goUp],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <section aria-labelledby="compare-heading" className="px-4 py-12 sm:px-7 sm:py-16 md:py-24" id="compare">
      <div className="mx-auto max-w-[1060px]">
        <ScrollReveal>
          <div className="rounded-[28px] border border-white/70 bg-white/60 px-4 py-7 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-md sm:px-6 sm:py-9 md:px-10 md:py-12">
            <div>
              <p className="font-mono2026 mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-h2026-muted">Compare</p>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <h2
                  className="font-serif2026 text-[clamp(1.35rem,3vw,2rem)] font-normal leading-[1.2] tracking-tight text-h2026-text"
                  id="compare-heading"
                >
                  How SIV compares to mail
                  <br />& in-person voting
                </h2>
                <p className="mt-1 max-w-[440px] text-[0.86rem] leading-[1.7] text-h2026-textSecondary md:mt-0 md:text-right">
                  Explore how it compares with these methods to understand where the protocol stands. SIV is designed as
                  an additional voting method, meant to work alongside mail and in-person voting.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                aria-expanded={!isCollapsed}
                className="flex w-full items-center justify-between rounded-2xl border border-h2026-border bg-white/70 px-4 py-3 text-[0.82rem] font-medium text-h2026-text shadow-sm transition-colors hover:border-h2026-green/70"
                onClick={toggleCollapsed}
                type="button"
              >
                <span>{isCollapsed ? 'Show detailed comparison table' : 'Hide detailed comparison table'}</span>
                <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-h2026-bg text-[0.9rem] text-h2026-muted">
                  <span
                    className={`inline-block transition-transform ${
                      isCollapsed ? 'rotate-0 translate-y-[1px]' : 'rotate-90 translate-y-[1px]'
                    }`}
                  >
                    ›
                  </span>
                </span>
              </button>

              {!isCollapsed && (
                <CompareTable
                  bountyEnabled={bountyEnabled}
                  isDescriptionShown={isDescriptionShown}
                  openedModalIndex={openedModalIndex}
                  setOpenedModalIndex={setOpenedModalIndex}
                  toggleBounty={toggleBounty}
                  toggleDescription={toggleDescription}
                />
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <CompareModal
        bountyEnabled={bountyEnabled}
        closeModal={closeModal}
        goLeft={goLeft}
        goRight={goRight}
        modalContent={modalContent}
        openedModalIndex={openedModalIndex}
      />
    </section>
  )
}