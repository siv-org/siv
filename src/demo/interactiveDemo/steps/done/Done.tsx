import { POSTER_PROPERTIES } from '../../content'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function Done({ completed, onRestart }: { completed: Set<string>; onRestart: () => void }) {
  return (
    <div>
      <p className="text-[0.95rem] text-h26-textSecondary">
        Poster properties you hit this run: <b>{completed.size}</b> / {POSTER_PROPERTIES.length}
      </p>
      <ul className="mt-4 space-y-2">
        {POSTER_PROPERTIES.map((p) => (
          <li className="flex items-center gap-2 text-[0.85rem]" key={p.id}>
            <span className={completed.has(p.id) ? 'text-h26-green' : 'text-h26-muted'}>
              {completed.has(p.id) ? '✓' : '○'}
            </span>
            {p.label}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.85rem] text-h26-textSecondary">
        Next builds could wrap the real vote UI + a live sandbox election. This prototype is for testing the story &
        room structure.
      </p>
      <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onRestart}>Run again</PrimaryButton>
        <SecondaryButton onClick={() => (window.location.href = '/protocol')}>Illustrated protocol</SecondaryButton>
        <SecondaryButton onClick={() => (window.location.href = '/resources')}>Resources</SecondaryButton>
      </div>
    </div>
  )
}
