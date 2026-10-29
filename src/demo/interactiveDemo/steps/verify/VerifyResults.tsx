import { Globe, LockKeyhole } from 'lucide-react'
import { ReactNode, useEffect, useRef } from 'react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function VerifyResults({
  auth,
  busy,
  electionId,
  onOpenResults,
  onRestart,
  receipt,
  resultsVersion,
  voteUrl,
}: {
  auth: string
  busy: boolean
  electionId: string
  onOpenResults: () => void
  onRestart: () => void
  receipt: ReactNode
  resultsVersion: number
  voteUrl: string
}) {
  const results = useRef<HTMLElement>(null)
  const vote = useRef<HTMLElement>(null)
  const scrollTo = (target: HTMLElement | null) =>
    target?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    })

  // On phones, bring newly opened results into view below the receipt.
  useEffect(() => {
    if (resultsVersion && !window.matchMedia('(min-width: 1024px)').matches) scrollTo(results.current)
  }, [resultsVersion])

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="overflow-hidden min-w-0 bg-white rounded-2xl border scroll-mt-6 border-black/10" ref={vote}>
          <div className="flex flex-wrap gap-y-1 gap-x-4 justify-between items-center px-4 py-3 border-b border-black/10 bg-h26-bg">
            <h2 className="flex gap-2 items-center m-0 text-sm font-medium leading-6 text-h26-text">
              <LockKeyhole aria-hidden="true" className="shrink-0 text-h26-green" size={16} strokeWidth={1.5} />
              Private to you
            </h2>
            <a
              className="inline-block text-xs leading-6 underline break-all text-h26-green decoration-h26-green/30 underline-offset-4 hover:decoration-h26-green"
              href={voteUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              local.gov/vote/2026-11?auth={auth}
            </a>
          </div>
          {receipt}
        </section>
        <section
          className="overflow-hidden min-w-0 bg-white rounded-2xl border scroll-mt-6 border-black/10"
          ref={results}
        >
          <div className="flex flex-wrap gap-y-1 gap-x-4 justify-between items-center px-4 py-3 border-b border-black/10 bg-h26-bg">
            <h2 className="flex gap-2 items-center m-0 text-sm font-medium leading-6 text-h26-text">
              <Globe aria-hidden="true" className="shrink-0 text-h26-green" size={16} strokeWidth={1.5} />
              Public to everyone
            </h2>
            <a
              className="inline-block text-xs leading-6 underline break-all text-h26-green decoration-h26-green/30 underline-offset-4 hover:decoration-h26-green"
              href={`/election/${electionId}`}
              rel="noopener noreferrer"
              target="_blank"
              title="Open the demo’s public results page"
            >
              local.gov/vote/2026-11/results
            </a>
          </div>
          {resultsVersion ? (
            <iframe
              className="block h-[1000px] w-full border-0 bg-white"
              key={`${electionId}-${resultsVersion}`}
              src={`/election/${electionId}`}
              title="SIV election results"
            />
          ) : (
            <div className="p-6 sm:p-8">
              <p className="mb-6 text-sm leading-relaxed text-h26-textSecondary">
                Typically, results are not published until the end of the election, but for this demo, you can open them
                now.
              </p>
              <PrimaryButton disabled={busy} onClick={onOpenResults}>
                {busy ? 'Opening results…' : 'View Results'}
              </PrimaryButton>
            </div>
          )}
          <div className="p-4 border-t border-black/10 lg:hidden">
            <SecondaryButton onClick={() => scrollTo(vote.current)}>Back to your vote ↑</SecondaryButton>
          </div>
        </section>
      </div>
      <div className="flex justify-end mt-6">
        <SecondaryButton onClick={onRestart}>Start again</SecondaryButton>
      </div>
    </>
  )
}
