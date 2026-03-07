import { ArrowUpRight, ChevronRight, Rss } from 'lucide-react'

import { ScrollReveal } from './ScrollReveal'

// ——— News cards data: add/remove/edit items here ———
const NEWS_ITEMS: { description: string; href: string; title: string }[] = [
  {
    description: 'For each paper voter, 50x voted digitally.',
    href: 'https://blog.siv.org/2025/12/11chooses',
    title: 'Multiple historic firsts, including the biggest digital election in US history',
  },
  {
    description: 'Preserving privacy & verifiability.',
    href: 'https://blog.siv.org/2025/08/overrides',
    title: 'Anti-coercion & vote-selling solution, deployed',
  },
  {
    description: '$10,000 prizes. Top security researchers.',
    href: 'https://hack.siv.org/reports/2024defcon',
    title: 'DEF CON Red-Team Hack\u00A0SIV Challenge: Results',
  },
]

export function NewsSection() {
  return (
    <section className="px-7 py-10 md:py-[60px]" id="news">
      <ScrollReveal className="mx-auto max-w-[1060px]">
        {/* Section label (e.g. "Latest") — change text or icon */}
        <p className="font-mono2026 mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-h2026-muted">
          <Rss size={19} />
          Latest
        </p>

        {/* Grid of news cards — layout controlled by grid classes */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {NEWS_ITEMS.map((item) => (
            <a
              className="group relative flex flex-col rounded-h2026 border border-h2026-border bg-h2026-bgCard pl-5 pr-5 pt-7 pb-6 no-underline text-h2026-text transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-h2026-borderStrong hover:shadow-h2026-md md:pl-6 md:pr-6 md:pt-8 md:pb-6 border-l-[3px]"
              href={item.href}
              key={item.title}
              rel="noreferrer"
              target="_blank"
            >
              {/* Card title */}
              <h3 className="font-serif2026 text-[0.95rem] font-normal  tracking-tight text-h2026-text pr-8">
                {item.title}
              </h3>
              {/* Card description */}
              <p className="mt-3 text-[0.78rem] leading-[1.6] text-h2026-textSecondary flex-1">{item.description}</p>
              {/* "Read" link + arrow (hover styles on group) */}
              <span className="mt-4 flex items-center gap-0.5 text-[0.65rem] text-h2026-muted transition-colors duration-200 ease-out group-hover:text-h2026-green">
                Read
                <ArrowUpRight
                  className="size-3 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </span>
            </a>
          ))}
        </div>

        {/* "See more" link to blog — change href or label */}
        <div className="flex justify-end mt-4">
          <a
            className="inline-flex items-center gap-1 text-[0.80em] text-h2026-muted no-underline transition-colors hover:text-h2026-text"
            href="https://blog.siv.org"
            rel="noreferrer"
            target="_blank"
          >
            <ChevronRight size={15} />
            See more
          </a>
        </div>
      </ScrollReveal>
    </section>
  )
}
