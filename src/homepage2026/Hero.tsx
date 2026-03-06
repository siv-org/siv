import { Globe } from 'lucide-react'

import { StartAVoteButton } from './StartAVoteButton'

export function Hero() {
  return (
    <section className="px-7 py-[100px] text-center md:py-[150px]">
      <div className="mx-auto max-w-[1060px]">
        <div className="animate-[fadeInUp_0.8s_ease_both]">
          <h1 className="font-serif2026 text-[clamp(2.5rem,6.5vw,5.2rem)] font-normal leading-[1.3] tracking-tight">
            Easy, Safe, Smart
            <br />
            Digital Voting
          </h1>
          <span className="mt-5 block font-sans text-[clamp(0.85rem,1.6vw,1.05rem)] font-semibold uppercase tracking-widest text-h2026-blue">
            even for the highest stakes environments
          </span>
        </div>
        <p className="mx-auto mb-12 mt-3 text-[clamp(0.7rem,1.3vw,0.85rem)] text-sm  tracking-widest leading-[1.65] text-h2026-textSecondary animate-[fadeInUp_0.8s_0.15s_ease_both]">
          <Globe className="inline size-[1.15em] align-[-0.175em] text-h2026-green" /> used by voters from 330 cities{' '}
          <br className="sm:hidden" />
          across 25 countries
        </p>
        <StartAVoteButton className="animate-[fadeInUp_0.8s_0.3s_ease_both]" />
      </div>
    </section>
  )
}
