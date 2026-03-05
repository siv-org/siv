import { ArrowUpRight } from 'lucide-react'

import type { Resource } from './resources-data'

export function ResourceCard({ category, description, href, icon: Icon, title }: Resource) {
  const isExternal = href.startsWith('http')

  return (
    <a
      className="group relative flex flex-col gap-4 rounded-h2026-lg border border-h2026-border bg-h2026-bgCard p-7 no-underline text-inherit transition-all duration-300 ease-out hover:-translate-y-1 hover:border-h2026-borderStrong hover:shadow-h2026-lg md:p-8"
      href={href}
      rel={isExternal ? 'noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-h2026 bg-h2026-bgWarm text-h2026-textSecondary transition-colors duration-300 group-hover:bg-h2026-green/10 group-hover:text-h2026-green">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="translate-y-0.5 text-h2026-muted opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} strokeWidth={2} />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono2026 text-[0.65rem] uppercase tracking-[0.18em] text-h2026-muted">
          {category}
        </span>
        <h3 className="font-serif2026 text-[1.15rem] font-normal leading-snug tracking-tight md:text-[1.25rem]">
          {title}
        </h3>
      </div>

      <p className="text-[0.82rem] leading-[1.7] text-h2026-textSecondary">{description}</p>

      <div className="mt-auto pt-2">
        <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-h2026-green transition-all duration-200 group-hover:gap-2.5">
          {isExternal ? 'View docs' : 'Explore'}
          <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={13} strokeWidth={2.5} />
        </span>
      </div>
    </a>
  )
}
