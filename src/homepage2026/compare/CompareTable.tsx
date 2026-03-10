import { Fragment } from 'react'

import type { OpenedModalIndex } from './compare-data'

import { methods, tableData } from './compare-data'
import { arraysEqual, getScore, interpolateColor } from './compare-utils'

type Props = {
  isDescriptionShown: boolean
  openedModalIndex: OpenedModalIndex
  setOpenedModalIndex: (index: OpenedModalIndex) => void
  toggleDescription: () => void
}

export function CompareTable({ isDescriptionShown, openedModalIndex, setOpenedModalIndex, toggleDescription }: Props) {
  return (
    <div className="mt-5">
      <div className="flex flex-col items-start gap-2 text-[0.8rem] text-h2026-textSecondary">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-h2026-border bg-white/70 px-3 py-1 text-[0.78rem] font-medium shadow-sm transition-colors hover:border-h2026-green/70"
          onClick={toggleDescription}
          type="button"
        >
          <span
            className={`inline-block h-3 w-3 rounded-full border ${
              isDescriptionShown ? 'border-h2026-green bg-h2026-green/80' : 'bg-white border-h2026-border'
            }`}
          />
          Show descriptions
        </button>
        <p className="max-w-[520px] text-[0.75rem] text-h2026-muted">Click a number for a detailed explanation.</p>
      </div>

      <div className="overflow-x-hidden mt-6 sm:overflow-x-auto">
        <table className="w-full min-w-0 border-collapse text-[0.8rem]">
          <thead className="sticky top-0 z-10 hidden bg-white/80 text-left text-[0.75rem] text-h2026-muted backdrop-blur md:table-header-group">
            <tr>
              <th className="min-w-0 py-2 pr-2 font-normal sm:min-w-[160px] sm:pr-4" />
              {methods.map((method) => (
                <th className="w-[14%] py-2 text-center font-normal" key={method}>
                  {method}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((cat, cIndex) => (
              <Fragment key={cat.name}>
                <tr>
                  <td className={cIndex === 0 ? 'pt-4' : 'pt-10'} colSpan={4}>
                    <div className="inline-flex rounded-full bg-h2026-green/[0.08] px-3 py-1 text-[0.78rem] font-medium text-h2026-green">
                      {cat.name}
                    </div>
                  </td>
                </tr>
                {cat.rows.map((row, rIndex) => (
                  <tr
                    className={`border-b border-h2026-border/25 md:hover:bg-h2026-bg/40 ${
                      isDescriptionShown ? 'align-top' : 'align-middle'
                    }`}
                    key={row.d_name}
                  >
                    <td className="py-3 pr-3 min-w-0 sm:py-4 sm:pr-6">
                      <div className="text-[0.85rem] font-medium text-h2026-text sm:text-[0.9rem]">{row.d_name}</div>
                      {isDescriptionShown && (
                        <p className="mt-2 max-w-[360px] text-[0.78rem] leading-[1.6] text-h2026-textSecondary">
                          {row.desc}
                        </p>
                      )}
                    </td>
                    {row.scores.map((score, colIndex) => (
                      <td
                        className="w-[22%] min-w-0 py-2 pl-1 pr-1 text-center sm:py-3 sm:pl-2 sm:pr-2 md:w-auto"
                        key={`${row.d_name}-${colIndex}`}
                      >
                        <div className="mb-1.5 flex min-h-[2.25rem] items-center justify-center rounded-full bg-white/70 px-1.5 py-1 text-[0.65rem] font-medium text-h2026-muted sm:mb-2 sm:min-h-[2.5rem] sm:px-2 sm:text-[0.7rem] md:hidden">
                          <span className="text-center">{methods[colIndex]}</span>
                        </div>
                        <button
                          className={`flex w-full items-center justify-center rounded-[10px] border border-white/60 px-2 text-[0.9rem] font-semibold text-slate-900 shadow-[0_1px_4px_rgba(15,23,42,0.16)] transition-all hover:shadow-[0_6px_18px_rgba(15,23,42,0.22)] ${
                            openedModalIndex &&
                            arraysEqual(openedModalIndex, [cIndex, rIndex, colIndex]) &&
                            'ring-2 ring-h2026-green/80'
                          } ${isDescriptionShown ? 'h-10 sm:h-12' : 'h-8 sm:h-9'}`}
                          onClick={() => setOpenedModalIndex([cIndex, rIndex, colIndex])}
                          style={{
                            backgroundColor: interpolateColor(getScore(score)),
                          }}
                          type="button"
                        >
                          {getScore(score)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
