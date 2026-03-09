import { Globe } from 'lucide-react'

import { StartAVoteButton } from './StartAVoteButton'

export function Hero() {
  return (
    <section className="px-7 pt-[11rem] pb-36 text-center md:pt-[12.5rem] md:pb-44">
      <div className="mx-auto max-w-[920px]">
        {/* Headline block — generous single-unit spacing */}
        <div className="animate-[fadeInUp_0.9s_ease-out_both]">
          <h1 className="font-serif2026 text-[clamp(2.5rem,6.5vw,5.2rem)] font-normal leading-[1.25] tracking-[-0.02em]">
            Easy, Safe, Smart
            <br />
            Digital Voting
          </h1>
          <span className="mt-8 block font-sans text-[clamp(0.8rem,1.5vw,1rem)] font-medium uppercase tracking-[0.2em] text-h2026-blue/90">
            even for the highest stakes environments
          </span>
        </div>

        {/* Social proof — sits close to tagline as one intro block */}
        <p className="mx-auto mt-4 max-w-md text-[clamp(0.7rem,1.25vw,0.82rem)] tracking-[0.12em] leading-[1.7] text-h2026-textSecondary/95 animate-[fadeInUp_0.9s_0.2s_ease-out_both]">
          <Globe className="inline size-[1.1em] align-[-0.2em] text-h2026-green/90 mr-1" />
          used by voters in 330+ cities <br className="sm:hidden" />
          across 25 countries
        </p>

        {/* CTA — clear visual next step */}
        <div className="mt-14 animate-[fadeInUp_0.9s_0.32s_ease-out_both]">
          <StartAVoteButton />
        </div>
      </div>
    </section>
  )
}
