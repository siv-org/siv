import { ReactNode, useEffect, useRef } from 'react'

import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function VerifyResults({
  busy,
  electionId,
  onOpenResults,
  onRestart,
  receipt,
  resultsVersion,
}: {
  busy: boolean
  electionId: string
  onOpenResults: () => void
  onRestart: () => void
  receipt: ReactNode
  resultsVersion: number
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
        <section className="min-w-0 scroll-mt-6" ref={vote}>
          <h2 className="mb-3 font-serif26 text-xl">
            <span className="lg:hidden">1. </span>Your submitted vote<span className="lg:hidden">:</span>
          </h2>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">{receipt}</div>
        </section>
        <section className="min-w-0 scroll-mt-6" ref={results}>
          <h2 className="mb-3 font-serif26 text-xl">
            <span className="lg:hidden">2. </span>Election results<span className="lg:hidden">:</span>
          </h2>
          {resultsVersion ? (
            <iframe
              className="block h-[1000px] w-full rounded-2xl border border-black/10 bg-white"
              key={`${electionId}-${resultsVersion}`}
              src={`/election/${electionId}`}
              title="SIV election results"
            />
          ) : (
            <div className="rounded-2xl border border-h26-green/20 bg-white p-6 sm:p-8">
              <p className="mb-6 text-sm leading-relaxed text-h26-textSecondary">
                Your vote is submitted. Open the results to find your Verification # in the published votes and compare
                it with your receipt.
              </p>
              <PrimaryButton disabled={busy} onClick={onOpenResults}>
                {busy ? 'Opening results…' : 'View Results'}
              </PrimaryButton>
            </div>
          )}
          <div className="mt-4 lg:hidden">
            <SecondaryButton onClick={() => scrollTo(vote.current)}>Back to your vote ↑</SecondaryButton>
          </div>
        </section>
      </div>
      <div className="mt-6 flex justify-end">
        <SecondaryButton onClick={onRestart}>Start again</SecondaryButton>
      </div>
    </>
  )
}
