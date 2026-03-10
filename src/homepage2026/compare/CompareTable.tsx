import { Fragment } from 'react'

import type { OpenedModalIndex } from './compare-data'

import { BountyRewardsSwitch } from './BountyRewardsSwitch'
import { methods, tableData } from './compare-data'
import { arraysEqual, getScore, interpolateColor } from './compare-utils'

type Props = {
  bountyEnabled: boolean
  isDescriptionShown: boolean
  openedModalIndex: OpenedModalIndex
  setOpenedModalIndex: (index: OpenedModalIndex) => void
  toggleBounty: () => void
  toggleDescription: () => void
}

export function CompareTable({
  bountyEnabled,
  isDescriptionShown,
  openedModalIndex,
  setOpenedModalIndex,
  toggleBounty,
  toggleDescription,
}: Props) {
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
        <p className="max-w-[520px] text-[0.75rem] text-h2026-muted">
          Click a number for a detailed explanation. Use arrow keys to move around.
        </p>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse text-[0.8rem]">
          <thead className="sticky top-0 z-10 hidden bg-white/80 text-left text-[0.75rem] text-h2026-muted backdrop-blur md:table-header-group">
            <tr>
              <th className="min-w-[160px] py-2 pr-4 font-normal" />
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
                    className={`border-b border-h2026-border/50 md:hover:bg-h2026-bg/40 ${
                      isDescriptionShown ? 'align-top' : 'align-middle'
                    }`}
                    key={row.d_name}
                  >
                    <td className="py-4 pr-6">
                      <div className="text-[0.9rem] font-medium text-h2026-text">
                        {row.d_name}
                        {row.d_name === 'Coercion resistance' && (
                          <span className="inline-block ml-2 align-middle">
                            <BountyRewardsSwitch bountyEnabled={bountyEnabled} toggleBounty={toggleBounty} />
                          </span>
                        )}
                      </div>
                      {isDescriptionShown && (
                        <p className="mt-2 max-w-[360px] text-[0.78rem] leading-[1.6] text-h2026-textSecondary">
                          {row.desc}
                        </p>
                      )}
                    </td>
                    {[...(bountyEnabled && row.scores_with_bounty ? row.scores_with_bounty : row.scores)].map(
                      (score, colIndex) => (
                        <td className="w-[22%] py-3 text-center md:w-auto" key={`${row.d_name}-${colIndex}`}>
                          <div className="mb-2 flex min-h-[2.5rem] items-center justify-center rounded-full bg-white/70 px-2 py-1 text-[0.7rem] font-medium text-h2026-muted md:hidden">
                            <span className="text-center">{methods[colIndex]}</span>
                          </div>
                          <button
                            className={`flex w-full items-center justify-center rounded-[10px] border border-white/60 px-2 text-[0.9rem] font-semibold text-slate-900 shadow-[0_1px_4px_rgba(15,23,42,0.16)] transition-all hover:shadow-[0_6px_18px_rgba(15,23,42,0.22)] ${
                              openedModalIndex &&
                              arraysEqual(openedModalIndex, [cIndex, rIndex, colIndex]) &&
                              'ring-2 ring-h2026-green/80'
                            } ${isDescriptionShown ? 'h-12' : 'h-9'}`}
                            onClick={() => setOpenedModalIndex([cIndex, rIndex, colIndex])}
                            style={{
                              backgroundColor: interpolateColor(getScore(score)),
                            }}
                            type="button"
                          >
                            {getScore(score)}
                          </button>
                        </td>
                      ),
                    )}
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
