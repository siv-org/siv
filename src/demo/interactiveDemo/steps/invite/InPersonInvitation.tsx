import { InviteQRCode } from './InviteQRCode'

export function InPersonInvitation({ auth, voteLink }: { auth: string; voteLink: string }) {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-[280px] flex-col items-center gap-5 rounded-xl border border-black/[0.08] bg-white px-6 py-8 shadow-sm">
        {voteLink && (
          <div className="flex flex-col items-center text-center">
            <span className="text-sm opacity-50">{auth}</span>
            <InviteQRCode auth={auth} showLink={false} voteLink={voteLink} />
          </div>
        )}
      </div>
    </div>
  )
}
