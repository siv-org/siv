import { ArrowRight, CreditCard, IdCard, Scan } from 'lucide-react'

export function PhotoIDSelfie({ auth, onContinue }: { auth: string; onContinue: () => void }) {
  return (
    <div className="px-6 py-8 sm:py-10">
      {/* The whole card opens the demo notice; no photos are collected. */}
      <button
        aria-label="Preview photo ID and selfie check"
        className="mx-auto flex w-full max-w-[380px] flex-col items-center rounded-2xl border border-solid border-h26-green/25 !bg-h26-bg px-6 py-8 text-h26-text transition-colors duration-200 hover:border-h26-green/50 hover:!bg-h26-green/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-h26-green disabled:cursor-not-allowed sm:py-10"
        disabled={!auth}
        onClick={() => {
          if (window.confirm("For this demo, we'll take you right to the ballot.")) onContinue()
        }}
        type="button"
      >
        {/* Instructions */}
        <span className="text-center font-serif26 text-xl">Confirm your identity.</span>
        <span className="mt-3 max-w-[280px] text-center text-[0.8rem] leading-relaxed text-h26-textSecondary">
          First, we’ll photograph the front and back of your ID. Then, take a selfie.
        </span>
        <span aria-hidden className="mt-7 flex items-center gap-4 text-h26-green sm:gap-6">
          {/* Front and back of the ID */}
          <span className="relative flex h-20 w-28 items-end">
            <CreditCard className="absolute right-0 top-0 h-14 w-20 -rotate-6 text-h26-green/40" strokeWidth={1} />
            <IdCard className="relative h-14 w-20 rounded-lg bg-h26-bg" strokeWidth={1.25} />
          </span>
          <ArrowRight className="size-4 text-h26-green/40" strokeWidth={1.5} />
          {/* Face outline inside scan corners */}
          <span className="relative flex size-16 items-center justify-center">
            <Scan className="absolute inset-0 size-16" strokeWidth={1} />
            <span className="h-9 w-7 rounded-[50%] border border-solid border-current" />
          </span>
        </span>
      </button>
    </div>
  )
}
