import { PrimaryButton } from './PrimaryButton'

export function NeedVote({ label, onStart }: { label?: string; onStart: () => void }) {
  return (
    <div>
      <p className="text-[0.9rem] text-h26-textSecondary">
        {label || 'Cast a vote first so this room has something to show.'}
      </p>
      <PrimaryButton className="mt-5" onClick={onStart}>
        Start as a voter
      </PrimaryButton>
    </div>
  )
}
