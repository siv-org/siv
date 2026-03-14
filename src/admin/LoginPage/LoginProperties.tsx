import { Check } from 'lucide-react'

import { ScrollReveal } from '../../homepage2026/ScrollReveal'

const PROPERTIES: { description: string; title: string }[] = [
  {
    description: 'Vote from any device in seconds. No installs, no friction.',
    title: 'Easy for voters',
  },
  {
    description: 'Every eligible voter gets exactly one vote. No double-voting.',
    title: 'One person, one vote',
  },
  {
    description: 'Strong privacy and coercion-resistance. Votes stay secret.',
    title: 'Private voting',
  },
  {
    description: 'You can prove the election was run fairly. Publicly auditable.',
    title: 'Provably fair',
  },
  {
    description: 'Run professional elections at a fraction of government election costs.',
    title: 'A fraction of the cost',
  },
]

type LoginPropertiesProps = { variant?: 'section' | 'sidebar' }

export function LoginProperties({ variant = 'section' }: LoginPropertiesProps) {
  const isSidebar = variant === 'sidebar'

  const content = (
    <>
      <h2 className="font-serif26 text-[clamp(1.35rem,3vw,1.75rem)] font-normal tracking-tight text-h26-text text-center lg:text-left">
        What you get with SIV
      </h2>
      <ul className={`grid gap-6 pl-0 list-none ${isSidebar ? 'mt-6' : 'mt-10 md:grid-cols-2'}`}>
        {PROPERTIES.map(({ description, title }) => (
          <li
            className="flex gap-4 items-start px-5 py-4 rounded-xl border shadow-sm border-h26-border bg-white/60"
            key={title}
          >
            <span className="mt-0.5 shrink-0 rounded-full bg-h26-green/12 p-1.5 text-h26-green">
              <Check className="size-4" strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="text-[0.95rem] font-medium text-h26-text">{title}</h3>
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
    <section aria-label="What you get with SIV" className="px-7 pt-16 pb-14 md:pt-20 md:pb-20 mx-auto max-w-[800px]">
      <div className="pt-14 border-t border-h26-border md:pt-16">
        <ScrollReveal>{content}</ScrollReveal>
      </div>
    </section>
  )
}
