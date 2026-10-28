import { UserRound } from 'lucide-react'

import { InviteQRCode } from './InviteQRCode'
import { PreviewCard } from './PreviewCard'

export function InPersonInvitation({ auth, voteLink }: { auth: string; voteLink: string }) {
  return (
    <PreviewCard icon={UserRound}>
      <div className="mt-5 flex flex-col items-center gap-3">
        {voteLink && <InviteQRCode auth={auth} voteLink={voteLink} />}
        <p className="font-mono26 text-sm tracking-widest text-h26-text">{auth || 'Preparing your code…'}</p>
      </div>
    </PreviewCard>
  )
}
