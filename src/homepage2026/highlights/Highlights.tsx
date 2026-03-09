import { ChevronRight, Sparkles } from 'lucide-react'

import { ScrollReveal } from '../ScrollReveal'
import { HighlightCard } from './HighlightCard'
import { HIGHLIGHTS } from './highlights-data'

const STAGGER_DELAY = 0.06

export function Highlights() {
  return (
    <section className="py-14 md:py-20" id="highlights">
      <div className="mx-auto max-w-[1060px] px-7">
        <ScrollReveal className="mb-8 md:mb-10">
          <p className="flex items-center gap-2 font-mono2026 text-xs uppercase tracking-[0.15em] text-h2026-muted">
            <Sparkles className="text-h2026-green" size={16} />
            Highlights
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          {HIGHLIGHTS.map((h, i) => (
            <ScrollReveal delay={i * STAGGER_DELAY} key={h.title}>
              <HighlightCard {...h} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="flex justify-end mt-8 md:mt-10" delay={HIGHLIGHTS.length * STAGGER_DELAY}>
          <a
            className="inline-flex items-center gap-1 text-[0.8rem] text-h2026-muted no-underline transition-colors duration-200 hover:text-h2026-text"
            href="https://blog.siv.org"
            rel="noreferrer"
            target="_blank"
          >
            <ChevronRight size={15} />
            More on our blog
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
