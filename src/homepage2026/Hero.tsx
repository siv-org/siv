import Link from 'next/link'

import type { ModalVariant } from './modalContent'

type HeroProps = {
  onWordClick: (variant: ModalVariant) => void
}

const HERO_WORDS: { label: string; variant: ModalVariant }[] = [
  { label: 'Easy', variant: 'easy' },
  { label: 'Safe', variant: 'safe' },
  { label: 'Smart', variant: 'smart' },
]

export function Hero({ onWordClick }: HeroProps) {
  return (
    <section className="px-7 py-[100px] text-center md:py-[150px]">
      <div className="mx-auto max-w-[1060px]">
        <div className="animate-[fadeInUp_0.8s_ease_both]">
          <h1 className="font-serif2026 text-[clamp(3rem,6.5vw,5.2rem)] font-normal leading-[1.08] tracking-tight">
            {HERO_WORDS.map(({ label, variant }, i) => (
              <span key={variant}>
                {i > 0 && ', '}
                <button
                  type="button"
                  className="hero-word relative cursor-pointer pr-0 transition-colors duration-200 hover:after:translate-x-0 hover:after:opacity-45 after:absolute after:ml-0.5 after:inline-block after:translate-x-[-3px] after:translate-y-px after:text-[0.45em] after:align-super after:font-light after:text-h2026-muted after:opacity-0 after:transition-all after:content-['›']"
                  onClick={() => onWordClick(variant)}
                >
                  {label}
                </button>
              </span>
            ))}
            ,<br />
            Digital Voting,
          </h1>
          <span className="mt-5 block font-sans text-[clamp(0.85rem,1.6vw,1.05rem)] font-semibold uppercase tracking-widest text-h2026-blue">
            even for the highest stakes
          </span>
        </div>
        <p className="mx-auto mb-12 mt-7 max-w-[460px] text-[1.05rem] font-light leading-[1.65] text-h2026-textSecondary animate-[fadeInUp_0.8s_0.15s_ease_both]">
          100,000+ vote selections,
          <br />
          by voters from 330 cities across 25 countries.
        </p>
        <Link
          className="group inline-flex items-center gap-2.5 rounded-full bg-h2026-green px-10 py-4 text-[0.92rem] font-medium text-white no-underline shadow-h2026-cta transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-h2026-cta-hover animate-[fadeInUp_0.8s_0.3s_ease_both]"
          href="/admin"
        >
          Start a Vote
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
