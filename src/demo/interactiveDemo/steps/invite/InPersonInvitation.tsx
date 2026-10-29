import { UserRound } from 'lucide-react'

import { InviteQRCode } from './InviteQRCode'

export function InPersonInvitation({ auth, voteLink }: { auth: string; voteLink: string }) {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[380px] overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
          <UserRound aria-hidden className="size-5 text-h26-green" strokeWidth={1.5} />
          <div>
            <p className="text-[0.8rem] font-medium text-h26-text">Department of Elections</p>
            <p className="mt-0.5 text-[0.65rem] text-h26-muted">City Mayoral Election</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="font-serif26 text-xl text-h26-text">You’re invited to vote.</h3>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
            Hi Alice, your ballot is ready. Your personal invitation gives you access to the City Mayoral Election.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3">
            {voteLink && <InviteQRCode auth={auth} voteLink={voteLink} />}
            <p className="font-mono26 text-sm tracking-widest text-h26-text">{auth || 'Preparing your code…'}</p>
          </div>
          <p className="mt-4 text-[0.68rem] leading-relaxed text-h26-muted">
            This invitation is unique to you. Keep it private.
          </p>
        </div>
      </div>
    </div>
  )
}
