import { Check } from 'lucide-react'

import { ScrollReveal } from '../../homepage2026/ScrollReveal'

const PROPERTIES: { _title: string; description: string }[] = [
  {
    _title: 'Easy for voters',
    description: 'Vote from any device in seconds. No installs, no friction.',
  },
  {
    _title: 'One person, one vote',
    description: 'Every eligible voter can cast only one vote. Auditable voter roll.',
  },
  {
    _title: 'Private voting',
    description: 'Strong privacy and coercion-resistance. No one can see how people vote.',
  },
  {
    _title: 'Provably fair',
    description: 'You can prove the election was run fairly. Publicly auditable.',
  },
  {
    _title: 'A fraction of the cost',
    description: 'Run government-grade elections at a fraction of the usual costs.',
  },
]

export function WhatYouGetWithSIV({ variant = 'section' }: { variant?: 'section' | 'sidebar' }) {
  const isSidebar = variant === 'sidebar'

  const content = (
    <>
      <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] font-normal tracking-tight text-h26-text text-center lg:text-left">
        What you get with SIV
      </h2>
      <ul className={`grid gap-6 pl-0 list-none ${isSidebar ? 'mt-6' : 'mt-10 md:grid-cols-2'}`}>
        {PROPERTIES.map(({ _title, description }, i) => (
          <li
            className={`flex gap-4 items-start px-5 py-4 rounded-xl border shadow-sm border-h26-border bg-white/60 ${
              !isSidebar && i === PROPERTIES.length - 1 ? 'md:col-span-2' : ''
            }`}
            key={_title}
          >
            <span className="mt-0.5 shrink-0 rounded-full bg-h26-green/12 p-1.5 text-h26-green">
              <Check className="size-4" strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="text-[0.95rem] font-medium text-h26-text">{_title}</h3>
              <p className="mt-1 text-[0.85rem] leading-[1.55] text-h26-textSecondary">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )

  if (isSidebar) {
    return (
      <div className="mt-8 w-full">
        <ScrollReveal>{content}</ScrollReveal>
      </div>
    )
  }

  return (
    <section aria-label="What you get with SIV" className="sm:px-7 pt-16 pb-14 md:pt-20 md:pb-20 mx-auto max-w-[800px]">
      <div className="pt-14 border-t border-h26-border md:pt-16">
        <ScrollReveal>{content}</ScrollReveal>
      </div>
    </section>
  )
}
