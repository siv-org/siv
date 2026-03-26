import { Check } from 'lucide-react'

import { ScrollReveal } from '../../homepage2026/ScrollReveal'

const PROPERTIES: { header: string; subtitle: string }[] = [
  { header: 'Easy for voters', subtitle: 'Vote from any device in seconds. No installs, no friction.' },
  { header: 'One person, one vote', subtitle: 'Every eligible voter can cast only one vote. Auditable voter roll.' },
  { header: 'Private voting', subtitle: 'Strong privacy and coercion-resistance. No one can see how people vote.' },
  { header: 'Provably fair', subtitle: 'You can prove the election was run fairly. Publicly auditable.' },
  { header: 'A fraction of the cost', subtitle: 'Run government-grade elections at a fraction of the usual costs.' },
]

export function WhatYouGetWithSIV() {
  return (
    <section
      aria-label="What you get with SIV"
      className="sm:px-7 mt-16 pb-14 md:mt-20 md:pb-20 mx-auto max-w-[800px] pt-14 border-t border-h26-border md:pt-16"
    >
      <ScrollReveal>
        <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] font-normal tracking-tight text-h26-text text-center lg:text-left">
          What you get with SIV
        </h2>

        {/* Properties list */}
        <ul className="grid gap-6 pl-0 mt-10 list-none md:grid-cols-2">
          {PROPERTIES.map(({ header, subtitle }, i) => (
            <li
              className={`flex gap-4 items-start px-5 py-4 rounded-xl border shadow-sm border-h26-border bg-white/60 ${
                i === PROPERTIES.length - 1 ? 'md:col-span-2' : ''
              }`}
              key={header}
            >
              {/* Left checkbox col */}
              <span className="mt-0.5 shrink-0 rounded-full bg-h26-green/12 p-1.5 text-h26-green">
                <Check className="size-4" strokeWidth={2.5} />
              </span>

              {/* Right text col */}
              <div>
                <h3 className="text-[0.95rem] font-medium text-h26-text">{header}</h3>
                <p className="mt-1 text-[0.85rem] leading-[1.55] text-h26-textSecondary">{subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  )
}
