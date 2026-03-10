import { ArrowUpRight, Check } from 'lucide-react'

import type { Highlight } from './highlights-data'

const cardClassName = [
  'group flex flex-col rounded-[18px] p-6 md:p-7',
  'bg-white/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]',
  'border border-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]',
  'backdrop-blur-md',
  'transition-all duration-300 ease-out',
  'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.6)] hover:border-white/90 hover:bg-white/70',
].join(' ')

export function HighlightCard({
  body,
  description,
  href,
  items,
  quotes,
  tag,
  title,
}: Highlight) {
  const blurb = description ?? body

  const content = (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono2026 text-[0.6rem] uppercase tracking-[0.2em] text-h2026-green">
          {tag}
        </span>
        <h3 className="font-serif2026 text-[0.98rem] font-normal leading-[1.35] tracking-tight text-h2026-text">
          {title}
        </h3>
      </div>
      {blurb && (
        <p className="mt-3.5 text-[0.81rem] leading-[1.65] text-h2026-textSecondary">{blurb}</p>
      )}
      {items && (
        <ul className="mt-4 grid gap-2">
          {items.map((item) => (
            <li className="flex items-start gap-2.5 text-[0.79rem] leading-[1.5] text-h2026-textSecondary" key={item}>
              <Check className="mt-0.5 size-3.5 shrink-0 text-h2026-green" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {quotes?.map((quote) => (
        <p
          className="mt-4 border-l-2 border-h2026-green/50 pl-4 font-serif2026 text-[0.81rem] italic leading-[1.65] text-h2026-textSecondary whitespace-pre-line"
          key={quote}
        >
          {'\u201C'}
          {quote}
          {'\u201D'}
        </p>
      ))}
      {href && (
        <span className="mt-5 flex items-center gap-0.5 text-[0.65rem] text-h2026-muted transition-colors duration-200 ease-out group-hover:text-h2026-green">
          Read
          <ArrowUpRight
            className="size-3 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a
        className={`${cardClassName} no-underline text-inherit`}
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {content}
      </a>
    )
  }

  return <div className={cardClassName}>{content}</div>
}
