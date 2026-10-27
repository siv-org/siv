import { ListRestart } from 'lucide-react'

export function StartNewBallotBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      className="-ml-3 inline-block rounded-lg sm:ml-0 bg-h26-green/[0.06] px-3 py-2 text-xs font-medium text-h26-green transition-colors hover:bg-h26-green/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h26-green disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      title="Starts a fresh demo ballot. Your previous vote stays in the demo results."
      type="button"
    >
      <ListRestart aria-hidden className="mr-2 inline-block align-[-3px]" size={16} strokeWidth={1.75} />
      <span>
        Start new ballot <span className="font-normal text-h26-textSecondary">(demo-only)</span>
      </span>
    </button>
  )
}
