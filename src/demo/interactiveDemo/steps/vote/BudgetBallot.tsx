import { Item as BallotItem } from 'src/vote/storeElectionInfo'
import { State as VoteState } from 'src/vote/vote-state'

import { DEMO_BUDGET_AVAILABLE, DEMO_BUDGET_OPTIONS } from '../../content'

export function BudgetBallot({
  design,
  dispatch,
  state,
}: {
  design: BallotItem
  dispatch: (payload: Record<string, string>) => void
  state: VoteState
}) {
  const budget = design.budget_available || DEMO_BUDGET_AVAILABLE
  const spent = DEMO_BUDGET_OPTIONS.reduce((sum, { name }) => {
    const raw = state.plaintext[`vote_${name}`]
    const n = raw && raw !== 'BLANK' ? Number(raw) : 0
    return sum + (Number.isFinite(n) && n > 0 ? n : 0)
  }, 0)
  const remaining = budget - spent

  return (
    <div>
      <p className="mb-3 text-[1rem] font-medium text-h26-text">{design.title}</p>
      <div
        className={`mb-5 inline-block rounded-full border px-3 py-1.5 text-[0.8rem] ${
          remaining >= 0
            ? 'border-h26-green/40 bg-h26-green/[0.06] text-h26-text'
            : 'border-red-300 bg-red-50 text-red-800'
        }`}
      >
        Budget available: ${remaining.toLocaleString()} of ${budget.toLocaleString()}
      </div>
      {remaining < 0 && <p className="mb-4 text-[0.75rem] font-medium text-red-700">You’ve exceeded the budget.</p>}
      <ul className="space-y-3">
        {DEMO_BUDGET_OPTIONS.map(({ name }) => {
          const raw = state.plaintext[`vote_${name}`]
          const digits = raw && raw !== 'BLANK' ? raw : ''
          return (
            <li className="flex gap-4 justify-between items-center" key={name}>
              <span className="text-[0.95rem] font-medium text-h26-text">{name}</span>
              <label className="block relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.95rem] text-h26-muted">
                  $
                </span>
                <input
                  className="h-10 w-36 rounded-lg border border-black/15 bg-white py-2 pl-7 pr-3 text-right font-mono26 text-[0.9rem] tabular-nums text-h26-text outline-none transition-colors hover:border-h26-green/40 focus:border-h26-green/50"
                  inputMode="numeric"
                  onChange={(e) => {
                    const next = e.target.value.replace(/\D/g, '')
                    dispatch({ [`vote_${name}`]: next || 'BLANK' })
                  }}
                  placeholder="0"
                  value={digits ? Number(digits).toLocaleString() : ''}
                />
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
