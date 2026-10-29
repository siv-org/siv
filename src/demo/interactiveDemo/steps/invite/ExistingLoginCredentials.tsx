import { ArrowRight, Building2 } from 'lucide-react'

import { PrimaryButton } from '../../shared/PrimaryButton'

export function ExistingLoginCredentials({ auth, onContinue }: { auth: string; onContinue: () => void }) {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <p className="mx-auto mb-6 max-w-md text-center text-[0.85rem] leading-relaxed text-h26-textSecondary">
        If your voters already have accounts with your organization, SIV can work with those existing login credentials.
      </p>
      <div className="mx-auto max-w-[380px] overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
          <Building2 aria-hidden className="size-5 shrink-0 text-h26-green" strokeWidth={1.5} />
          <div>
            <p className="text-[0.8rem] font-medium text-h26-text">Your organization</p>
            <p className="mt-0.5 text-[0.65rem] text-h26-muted">Member portal · Example</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <PrimaryButton
            disabled={!auth}
            onClick={() => {
              if (window.confirm("For this demo, we'll take you right to the ballot.")) onContinue()
            }}
          >
            Sign in with your existing account <ArrowRight aria-hidden className="ml-2 size-4 shrink-0" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
