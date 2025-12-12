import { useElectionId } from './use-election-id'

export const HowDoIVerify = (): JSX.Element | null => {
  const electionId = useElectionId()

  if (electionId !== '1764864466435') return null

  return (
    <details className="group mt-1.5 mb-4 text-slate-800">
      <summary className="flex cursor-pointer items-center gap-1 [&::-webkit-details-marker]:hidden text-[12px] hover:text-emerald-800">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500 bg-emerald-50 text-[10px] font-semibold text-emerald-700 shadow-sm group-open:bg-emerald-600 group-open:text-white">
          i
        </span>
        <span>How do I verify my vote is here?</span>
      </summary>

      <div className="mt-1.5 rounded-md bg-emerald-50 px-3 py-2 text-[11px] text-slate-900 shadow-sm space-y-1">
        <div>1. Re-open the same link you used to cast your vote, from the same device.</div>
        <div>
          2. Match your green <span className="font-semibold">verification #</span> to find your vote in this table.
        </div>
      </div>
    </details>
  )
}
