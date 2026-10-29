import { Landmark } from 'lucide-react'
import { buildSubject } from 'src/_shared/invitationEmail'

export function TextMessage({ auth, onContinue, voteLink }: { auth: string; onContinue: () => void; voteLink: string }) {
  return (
    <div className="bg-[#f3f5f8] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-[360px] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-sm">
        <div className="flex flex-col items-center gap-1.5 border-b border-black/[0.06] bg-[#f9f9fb] px-4 py-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#9398a2] text-white">
            <Landmark aria-hidden className="size-6" strokeWidth={1.5} />
          </div>
          <p className="text-xs font-medium text-[#1c1c1e]">Department of Elections</p>
        </div>
        <div className="px-4 pb-10 pt-5 text-[14px] leading-snug text-[#1c1c1e]">
          <p className="mb-2 text-center text-[10px] font-medium text-[#86868b]">Text Message · Today 9:00 AM</p>
          <div className="relative isolate mr-3 space-y-3 rounded-[18px] bg-[#e9e9eb] px-3 py-2.5 before:absolute before:bottom-0 before:-left-[7px] before:-z-10 before:h-5 before:w-5 before:rounded-br-[16px] before:bg-[#e9e9eb] after:absolute after:bottom-0 after:-left-[26px] after:-z-10 after:h-5 after:w-[26px] after:rounded-br-[10px] after:bg-white">
            <p>{buildSubject('City Mayoral Election')}</p>
            <p>Click here to securely cast your vote:</p>
            {voteLink ? (
              <a
                className="block break-all text-[#007aff] underline"
                href={voteLink}
                onClick={(event) => {
                  event.preventDefault()
                  onContinue()
                }}
              >
                local.gov/vote?auth={auth}
              </a>
            ) : (
              <p className="text-[#86868b]">Preparing your invitation…</p>
            )}
            <p>This link is unique for you.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
