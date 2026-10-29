import { ArrowRight, IdCard, Landmark } from 'lucide-react'

import { PrimaryButton } from '../../shared/PrimaryButton'

export function DigitalGovernmentID({ auth, onContinue }: { auth: string; onContinue: () => void }) {
  // Simulate returning from successful provider sign-in; no credentials or identity service are used here.
  // ponytail: illustrative checks only; real credential flows require provider integrations.
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[380px] overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm">
        {/* Election header */}
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
          <Landmark aria-hidden className="size-5 shrink-0 text-h26-green" strokeWidth={1.5} />
          <div>
            <p className="text-[0.8rem] font-medium text-h26-text">Department of Elections</p>
            <p className="mt-0.5 text-[0.65rem] text-h26-muted">City Mayoral Elections</p>
          </div>
        </div>
        {/* Sign-in instructions */}
        <div className="p-5 sm:p-6">
          <h3 className="font-serif26 text-xl text-h26-text">Confirm your identity.</h3>
          <div className="mt-2">
            <p className="mb-5 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Use your electronic ID to access your ballot.
            </p>
            {/* Demo notice, then open the ballot */}
            <PrimaryButton
              disabled={!auth}
              onClick={() => {
                if (window.confirm("For this demo, we'll take you right to the ballot.")) onContinue()
              }}
            >
              <IdCard aria-hidden className="mr-2 size-5" />
              Continue with eID <ArrowRight aria-hidden className="ml-2 size-4" />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
