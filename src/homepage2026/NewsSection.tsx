import { ChevronRight, Rss } from 'lucide-react'

import { ScrollReveal } from './ScrollReveal'

const NEWS_ITEMS: { description: string; href: string; title: string }[] = [
  {
    description: 'For each paper voter, 50x voted digitally.',
    href: 'https://blog.siv.org/2025/12/11chooses',
    title: 'Multiple historic firsts, incl. the biggest digital election in US history',
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
        <p className="font-mono2026 mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-h2026-muted">
          <Rss size={19} />
          Latest
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <a
              className="group relative flex flex-col gap-2 rounded-h2026 border border-h2026-border bg-h2026-bgCard p-5 no-underline text-inherit transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-h2026-borderStrong hover:shadow-h2026-md md:px-6 md:py-6 after:absolute after:right-5 after:top-[22px] after:-translate-x-1.5 after:text-[0.9rem] after:text-h2026-muted after:opacity-0 after:transition-all after:content-['→'] group-hover:after:translate-x-0 group-hover:after:opacity-100 after:md:right-6"
              href={item.href}
              key={item.title}
              rel="noreferrer"
              target="_blank"
            >
              <h3 className="pr-5 text-[0.92rem] font-medium leading-snug md:pr-6">{item.title}</h3>
              <p className="text-[0.78rem] leading-[1.5] text-h2026-muted">{item.description}</p>
            </a>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <a
            className="inline-flex items-center gap-1 text-[0.80em] text-h2026-muted no-underline transition-colors hover:text-inherit"
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
