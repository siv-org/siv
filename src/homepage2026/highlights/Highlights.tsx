import { ChevronRight, Rss } from 'lucide-react'

import { ScrollReveal } from '../ScrollReveal'
import { HighlightCard } from './HighlightCard'
import { HIGHLIGHTS } from './highlights-data'

const STAGGER_DELAY = 0.06

export function Highlights() {
  return (
    <section className="py-14 md:py-20" id="highlights">
      {/* Floating green panel: independent from page background */}
      <div className="mx-4 md:mx-6 lg:mx-10">
        <div
          className="mx-auto max-w-[1060px] rounded-[24px] bg-h26-green/[0.06] px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20"
          style={{ boxShadow: '0 4px 40px -8px rgba(26,107,74,0.12), 0 0 0 1px rgba(26,107,74,0.04)' }}
        >
          <ScrollReveal className="mb-8 md:mb-12">
            <p className="flex gap-2 items-center text-xs uppercase tracking-[0.15em] font-mono26 text-h26-muted">
              <Rss className="text-h26-green" size={16} />
              Highlights
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-7">
            {HIGHLIGHTS.map((h, i) => (
              <ScrollReveal delay={i * STAGGER_DELAY} key={h.title}>
                <HighlightCard {...h} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="flex justify-end mt-10 md:mt-12" delay={HIGHLIGHTS.length * STAGGER_DELAY}>
            <a
              className="inline-flex items-center gap-1 text-[0.8rem] text-h26-muted no-underline transition-colors duration-200 hover:text-h26-text"
              href="https://blog.siv.org"
              rel="noreferrer"
              target="_blank"
            >
              <ChevronRight size={15} />
              More on our blog
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
