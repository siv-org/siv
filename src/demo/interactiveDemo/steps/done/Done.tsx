import { POSTER_PROPERTIES } from '../../content'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function Done({
  completed,
  onRestart,
  onReview,
}: {
  completed: Set<string>
  onRestart: () => void
  onReview: (id: string) => void
}) {
  return (
    <div>
      <p className="text-[0.95rem] text-h26-textSecondary">
        Here is the evidence this walkthrough covered. Open any claim to return to the part of the demo that supports
        it.
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {POSTER_PROPERTIES.map((p) => {
          const explored = completed.has(p.id)
          return (
            <li key={p.id}>
              <button
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  explored
                    ? 'border-h26-green/30 bg-h26-green/[0.06] hover:bg-h26-green/[0.1]'
                    : 'border-black/10 bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.04]'
                }`}
                onClick={() => onReview(p.id)}
                type="button"
              >
                <span className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                      explored ? 'border-h26-green bg-h26-green text-white' : 'border-black/15 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span>
                    <span className="block text-[0.82rem] font-medium leading-snug text-h26-text">{p.label}</span>
                    <span className="mt-1 block text-[0.72rem] leading-snug text-h26-textSecondary">{p.short}</span>
                    {!explored && (
                      <span className="mt-2 block text-[0.68rem] font-medium text-h26-muted">Optional step not explored</span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onRestart}>Run again</PrimaryButton>
        <SecondaryButton onClick={() => (window.location.href = '/protocol')}>Illustrated protocol</SecondaryButton>
        <SecondaryButton onClick={() => (window.location.href = '/resources')}>Resources</SecondaryButton>
      </div>
    </div>
  )
}
