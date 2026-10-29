import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function PreviewCard({
  children,
  icon: Icon,
  identity = false,
  rounded = false,
}: {
  children: ReactNode
  icon: LucideIcon
  identity?: boolean
  rounded?: boolean
}) {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <div
        className={`mx-auto max-w-[380px] overflow-hidden border border-black/[0.08] bg-white shadow-sm ${
          rounded ? 'rounded-[28px]' : 'rounded-xl'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
          <Icon aria-hidden className="size-5 text-h26-green" strokeWidth={1.5} />
          <div>
            <p className="text-[0.8rem] font-medium text-h26-text">
              {identity ? 'Voter identity check' : 'Department of Elections'}
            </p>
            <p className="mt-0.5 text-[0.65rem] text-h26-muted">City Mayoral Election</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="font-serif26 text-xl text-h26-text">
            {identity ? 'Confirm it’s you.' : 'You’re invited to vote.'}
          </h3>
          {!identity && (
            <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Hi Alice, your ballot is ready. Your personal invitation gives you access to the City Mayoral Election.
            </p>
          )}
          {children}
          {!identity && (
            <p className="mt-4 text-[0.68rem] leading-relaxed text-h26-muted">
              This invitation is unique to you. Keep it private.
            </p>
          )}
        </div>
      </div>
      {identity && (
        <p className="mx-auto mt-5 max-w-[360px] text-center text-[0.7rem] leading-relaxed text-h26-muted">
          Example flow. Availability depends on the election’s setup and required integrations. No identity information
          is collected in this demo.
        </p>
      )}
    </div>
  )
}
