import { ArrowRight, MessageSquare } from 'lucide-react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { PreviewCard } from './PreviewCard'

export function TextInvitation({ auth, onContinue }: { auth: string; onContinue: () => void }) {
  return (
    <PreviewCard icon={MessageSquare} rounded>
      <div className="mt-5">
        <PrimaryButton disabled={!auth} onClick={onContinue}>
          Access your ballot <ArrowRight aria-hidden className="ml-2 size-4" />
        </PrimaryButton>
      </div>
    </PreviewCard>
  )
}
