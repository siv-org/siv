import { LucideIcon, ShieldCheck } from 'lucide-react'

export function ShowcaseCard({ caption, icon: Icon }: { caption: string; icon: LucideIcon }) {
  // ponytail: illustrative checks only; real credential flows require provider integrations.
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[380px] overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
          <Icon aria-hidden className="size-5 text-h26-green" strokeWidth={1.5} />
          <div>
            <p className="text-[0.8rem] font-medium text-h26-text">Voter identity check</p>
            <p className="mt-0.5 text-[0.65rem] text-h26-muted">City Mayoral Election</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="font-serif26 text-xl text-h26-text">Confirm it’s you.</h3>
          <div className="my-5 rounded-xl bg-h26-bg p-4 text-center">
            <Icon aria-hidden className="mx-auto size-10 text-h26-green" strokeWidth={1} />
            <p className="mt-3 text-[0.72rem] text-h26-textSecondary">{caption}</p>
          </div>
          <div className="flex items-start gap-2 text-[0.75rem] leading-relaxed text-h26-green">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
            <p>
              Once verified, your identity is matched to the voter list and your assigned Voter Code is used
              automatically.
            </p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-[360px] text-center text-[0.7rem] leading-relaxed text-h26-muted">
        Example flow. Availability depends on the election’s setup and required integrations. No identity information is
        collected in this demo.
      </p>
    </div>
  )
}
