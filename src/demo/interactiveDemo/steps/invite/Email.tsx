import { Mail, Reply, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { buildEmailHtml, buildInvitationBody, buildSubject } from 'src/_shared/invitationEmail'

export function Email({ auth, onContinue, voteLink }: { auth: string; onContinue: () => void; voteLink: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    let current = true
    setHtml('')
    if (voteLink) {
      const link = new URL(voteLink, window.location.origin).href
      buildInvitationBody({ link, subject_line: buildSubject('City Mayoral Election') }).then((text) => {
        // ponytail: repair the legacy table row only for browser display; remove when the shared template uses a cell.
        const doc = new DOMParser().parseFromString(
          buildEmailHtml({ preheader: `Click here to securely cast your vote: ${link}`, text }).replace(
            /<tr style="display: block; margin: 30px;">([\s\S]*?)<\/tr>/,
            '<tr><td style="padding: 30px;">$1</td></tr>',
          ),
          'text/html',
        )
        // Set navigation before rendering so the ballot can never open inside the email preview.
        doc.querySelectorAll('a').forEach((ballotLink) => {
          ballotLink.textContent = `local.gov/vote?auth=${auth}`
          ballotLink.target = '_top'
        })
        if (current) setHtml(doc.body.outerHTML)
      })
    }
    return () => {
      current = false
    }
  }, [auth, voteLink])

  if (!html) return <p className="p-6 text-sm text-h26-muted">Preparing your invitation…</p>
  return (
    <div className="bg-[#eef2f7] px-3 pb-3 pt-8 sm:px-5 sm:pb-5 sm:pt-10">
      <div className="overflow-hidden rounded-xl border border-black/[0.09] bg-white shadow-sm">
        <div className="px-4 py-5 sm:px-5">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <h3 className="text-[1rem] font-medium leading-snug text-h26-text">
              {buildSubject('City Mayoral Election')}
            </h3>
            <span className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[10px] text-h26-muted">Inbox</span>
          </div>
          <div className="flex items-start gap-3">
            <div
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-h26-green text-sm font-medium text-white"
            >
              <Mail className="size-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-[0.8rem] font-semibold text-h26-text">Department of Elections</p>
                <div className="flex items-center gap-2 text-h26-muted">
                  <span className="text-[0.65rem]">9:00 AM</span>
                  <Star aria-hidden className="size-3.5" />
                  <Reply aria-hidden className="size-3.5" />
                </div>
              </div>
              <p className="mt-0.5 text-[0.7rem] text-h26-textSecondary">&lt;election@siv.org&gt;</p>
              <p className="mt-1 text-[0.7rem] text-h26-muted">to Alice &lt;alice@example.com&gt;</p>
            </div>
          </div>
        </div>
        <div className="mx-3 mb-4 overflow-hidden sm:mx-4">
          <iframe
            className="block h-[480px] w-full border-0"
            onLoad={(event) => {
              const frame = event.currentTarget
              const doc = frame.contentDocument
              if (!doc) return
              frame.style.height = `${Math.max(360, doc.documentElement.scrollHeight)}px`
              // Keep normal clicks in the demo flow; the link's native target also prevents nested navigation.
              doc.querySelector('a')?.addEventListener('click', (event) => {
                event.preventDefault()
                onContinue()
              })
            }}
            sandbox="allow-same-origin allow-top-navigation-by-user-activation"
            // Email clients supply their own default font; keep that context outside the shared message template.
            srcDoc={`<!doctype html><html><head><style>body { font-family: Arial, sans-serif; }</style></head>${html}</html>`}
            title="SIV invitation email"
          />
        </div>
      </div>
    </div>
  )
}
