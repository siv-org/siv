import { Library } from 'lucide-react'
import Link from 'next/link'

import { ScrollReveal } from './ScrollReveal'

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="px-7 py-16 md:py-24" id="how-it-works">
      <div className="mx-auto max-w-[1060px]">
        <ScrollReveal>
          <div className="rounded-[28px] bg-h2026-green/[0.06] px-8 py-14 md:px-14 md:py-20 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
            <p
              className="font-mono2026 mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] text-h2026-muted"
              id="how-it-works-heading"
            >
              <Library size={16} />
              Resources
            </p>
            <h2 className="font-serif2026 text-[clamp(1rem,5vw,2rem)] font-normal leading-[1.25] tracking-tight">
              Learn How SIV Works
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[0.88rem] leading-[1.7] text-h2026-textSecondary">
              From high-level illustrations to formal specifications — everything you need to understand the SIV
              protocol.
            </p>
            <Link
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-h2026-green/30 bg-h2026-green/[0.06] px-6 py-3 text-[0.88rem] font-medium text-h2026-green no-underline shadow-sm transition-colors hover:border-h2026-green/70 hover:bg-h2026-green/[0.11]"
              href="/resources"
            >
              View resources
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
