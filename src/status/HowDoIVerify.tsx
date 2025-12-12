import { useElectionId } from './use-election-id'

export const HowDoIVerify = (): JSX.Element | null => {
  const electionId = useElectionId()

  if (electionId !== '1764864466435') return null

  return (
    <details className="group mt-1.5 mb-1.5 text-[12px] text-slate-800">
      <summary className="flex cursor-pointer items-center gap-1 list-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500 bg-emerald-50 text-[10px] font-semibold text-emerald-700 shadow-sm group-open:bg-emerald-600 group-open:text-white">
          i
        </span>
        <span className="underline decoration-emerald-400 decoration-dotted underline-offset-2">
          How do I verify my vote is in here?
        </span>
      </summary>
      <div className="mt-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] leading-snug text-slate-900 shadow-sm">
        Match the green <span className="font-semibold">verification #</span> on your receipt with the same number in
        this table. If your number appears here, your encrypted ballot was included in the tally.
      </div>
    </details>
  )
}
