import { Globe } from 'lucide-react'
import Link from 'next/link'

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
          <Globe className="inline size-[1.15em] align-[-0.175em]" /> used by voters from 330 cities{' '}
          <br className="sm:hidden" />
          across 25 countries
        </p>
        <Link
          className="group inline-flex items-center gap-2.5 rounded-full bg-h2026-green px-10 py-4 text-[0.92rem] font-medium text-white no-underline shadow-h2026-cta transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-h2026-cta-hover animate-[fadeInUp_0.8s_0.3s_ease_both]"
          href="/admin"
        >
          Start a Vote
          <svg
            className="transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="16"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
