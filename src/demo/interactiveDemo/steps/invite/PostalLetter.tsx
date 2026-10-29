import { Mail, Vote } from 'lucide-react'

import { InviteQRCode } from './InviteQRCode'

export function PostalLetter({
  auth,
  onContinue,
  voteLink,
}: {
  auth: string
  onContinue: () => void
  voteLink: string
}) {
  return (
    <div className="px-3 pb-3 pt-8 sm:px-6 sm:pb-6 sm:pt-10">
      <section
        aria-label="Envelope addressed to Alice Jones"
        className="mx-auto mb-6 flex min-h-[260px] max-w-[540px] flex-col justify-between border border-[#20392e]/20 bg-white p-4 text-h26-text shadow-[0_2px_8px_rgba(32,57,46,0.08)] sm:aspect-[23/10] sm:min-h-0 sm:p-5 sm:pb-3"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="text-[10px] leading-relaxed sm:text-[11px]">
            <p className="font-medium">Department of Elections</p>
            <p>100 Civic Center Drive</p>
            <p>Sample City, ST 12345</p>
          </div>
          <div aria-hidden className="flex h-14 w-12 shrink-0 border-[3px] border-dotted border-[#20392e]/60 p-1">
            <div className="flex w-full items-center justify-center border border-[#20392e]/30">
              <Mail className="size-5 text-h26-muted" strokeWidth={1} />
            </div>
          </div>
        </div>

        <div className="py-4 text-center text-[11px] leading-relaxed sm:py-1 sm:text-[12px]">
          <p className="font-medium">Alice Jones</p>
          <p>1234 Evergreen Terrace</p>
          <p>Sample City, ST 12345</p>
        </div>

        <div className="text-center">
          <p className="text-[0.85rem] font-semibold uppercase tracking-[0.08em] sm:text-[1rem]">
            City Mayoral Election
          </p>
          <p className="mt-0.5 flex items-center justify-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em]">
            <Vote aria-hidden className="size-4 text-h26-green" strokeWidth={1.5} />
            Personal invitation to vote
          </p>
        </div>
      </section>
      <article
        aria-label="Personal invitation to the City Mayoral Election"
        className="mx-auto max-w-[480px] border border-[#20392e]/20 bg-white px-5 py-7 shadow-[0_2px_8px_rgba(32,57,46,0.08)] sm:px-8 sm:py-8"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#20392e]/15 pb-4">
          <div>
            <p className="text-[0.85rem] font-semibold text-h26-text">Department of Elections</p>
            <p className="mt-1 text-[0.7rem] text-h26-textSecondary">City Mayoral Election</p>
          </div>
          <p className="font-mono26 text-right text-[9px] uppercase leading-relaxed tracking-[0.1em] text-h26-muted">
            Personal invitation
            <br />
            Demo election
          </p>
        </header>

        <p className="font-mono26 mt-5 text-[9px] uppercase tracking-[0.16em] text-h26-green">Invitation to vote</p>
        <h2 className="font-serif26 mt-2 text-[clamp(0.65rem,3vw,1.1rem)] font-normal leading-snug text-h26-text whitespace-nowrap">
          You’re invited to have your say.
        </h2>

        <div className="mt-5 space-y-3 text-[0.8rem] leading-relaxed text-h26-text">
          <p>Dear Alice,</p>
          <p>
            You’re invited to vote in the <strong className="font-semibold">City Mayoral Election</strong>. Cast your
            ballot from your phone or computer using your personal Voter Code below.
          </p>
          <p>
            Your vote stays private. Once results are published, you can verify that your vote was counted correctly.
          </p>
          <p>
            Thank you for taking part,
            <br />
            <span className="font-medium">Your election administrator</span>
          </p>
        </div>

        <div className="mt-5 border-t border-dashed border-[#20392e]/25 pt-5">
          <p className="font-mono26 text-center text-[9px] uppercase tracking-[0.14em] text-h26-textSecondary">
            Your personal voting details
          </p>
          <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-5">
            {voteLink && <InviteQRCode auth={auth} voteLink={voteLink} />}
            <div className="text-center sm:text-left">
              <p className="text-[0.8rem] text-h26-textSecondary">Scan the QR code, or visit</p>
              <button
                className="mt-1 font-medium text-h26-green underline underline-offset-4 hover:text-h26-greenHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-h26-green"
                onClick={onContinue}
                type="button"
              >
                local.gov/vote
              </button>
              <p className="mt-4 text-[0.75rem] text-h26-textSecondary">and enter your Voter Code:</p>
              <p className="font-mono26 mt-1 text-[1rem] font-medium tracking-[0.12em] text-h26-text">{auth}</p>
            </div>
          </div>
          <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-h26-textSecondary">
            This invitation is unique to you. Your Voter Code can only be used once.
          </p>
        </div>
      </article>
    </div>
  )
}
