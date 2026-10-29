import { ArrowRight, IdCard } from 'lucide-react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { ShowcaseCard } from './ShowcaseCard'

export function DigitalGovernmentID({ auth, onContinue }: { auth: string; onContinue: () => void }) {
  // Simulate returning from successful provider sign-in; no credentials or identity service are used here.
  return (
    <ShowcaseCard icon={IdCard}>
      <div className="mt-2">
        <p className="mb-5 text-[0.8rem] leading-relaxed text-h26-textSecondary">
          Use your electronic ID to access your ballot.
        </p>
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
    </ShowcaseCard>
  )
}
