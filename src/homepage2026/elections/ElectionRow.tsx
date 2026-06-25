import { ArrowUpRight } from 'lucide-react'

import type { Election } from './elections-data'

export function ElectionRow({ category, description, href, secondaryHref, secondaryLabel, title }: Election) {
  const [date, ...rest] = category.split('·')

  return (
    <a
      className="grid grid-cols-1 gap-x-8 gap-y-2 py-7 no-underline transition-colors group text-inherit md:grid-cols-[160px_1fr] md:py-8"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {/* Date / context */}
      <span className="font-mono26 text-[0.68rem] uppercase tracking-[0.16em] text-h26-muted md:pt-1.5">
        {date.trim()}
        {rest.length > 0 && (
          <>
            <span className="md:hidden"> · </span>
            <span className="inline md:block md:text-h26-muted/70">{rest.join('·').trim()}</span>
          </>
        )}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="flex items-start gap-2 font-serif26 text-[1.3rem] font-normal leading-snug tracking-tight transition-colors group-hover:text-h26-green md:text-[1.5rem]">
          <span>{title}</span>
          <ArrowUpRight
            className="mt-1 shrink-0 text-h26-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-h26-green"
            size={18}
            strokeWidth={2}
          />
        </h3>

        <p className="max-w-[560px] text-[0.85rem] leading-[1.7] text-h26-textSecondary">{description}</p>

        {secondaryHref && (
          <span
            className="inline-flex items-center gap-1.5 mt-1 text-[0.76rem] text-h26-muted transition-colors hover:text-h26-text w-fit"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.open(secondaryHref, '_blank', 'noopener,noreferrer')
            }}
            role="link"
            tabIndex={0}
          >
            {secondaryLabel}
            <ArrowUpRight size={12} strokeWidth={2} />
          </span>
        )}
      </div>
    </a>
  )
}
