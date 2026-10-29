import { LucideIcon, ShieldCheck } from 'lucide-react'

import { PreviewCard } from './PreviewCard'

export function IdentityCheckCardDesign({ caption, icon: Icon }: { caption: string; icon: LucideIcon }) {
  // ponytail: illustrative checks only; real credential flows require provider integrations.
  return (
    <PreviewCard icon={Icon} identity>
      <div className="my-5 rounded-xl bg-h26-bg p-4 text-center">
        <Icon aria-hidden className="mx-auto size-10 text-h26-green" strokeWidth={1} />
        <p className="mt-3 text-[0.72rem] text-h26-textSecondary">{caption}</p>
      </div>
      <div className="flex items-start gap-2 text-[0.75rem] leading-relaxed text-h26-green">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
        <p>
          Once verified, your identity is matched to the voter list and your assigned Voter Code is used automatically.
        </p>
      </div>
    </PreviewCard>
  )
}
