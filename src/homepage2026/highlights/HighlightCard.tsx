import { ArrowUpRight, Check } from 'lucide-react'

import type { Highlight } from './highlights-data'

const cardClassName = [
  'group flex flex-col rounded-h2026 border border-h2026-border p-5 md:p-6',
  'bg-gradient-to-br from-h2026-bgCard via-h2026-bgCard to-h2026-green/[0.06]',
  'transition-all duration-300 ease-out',
  'hover:-translate-y-0.5 hover:border-h2026-borderStrong hover:shadow-h2026-md',
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
      <span className="font-mono2026 text-[0.6rem] uppercase tracking-[0.2em] text-h2026-green">
        {tag}
      </span>
      <h3 className="mt-2 font-serif2026 text-[0.95rem] font-normal leading-snug tracking-tight text-h2026-text">
        {title}
      </h3>
      {blurb && (
        <p className="mt-2.5 text-[0.8rem] leading-[1.6] text-h2026-textSecondary">{blurb}</p>
      )}
      {items && (
        <ul className="mt-3 grid gap-1.5">
          {items.map((item) => (
            <li className="flex items-start gap-2 text-[0.78rem] text-h2026-textSecondary" key={item}>
              <Check className="mt-0.5 size-3 shrink-0 text-h2026-green" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {quotes?.map((quote) => (
        <p
          className="mt-4 border-l-2 border-h2026-green/40 pl-3 font-serif2026 text-[0.8rem] italic leading-[1.6] text-h2026-textSecondary whitespace-pre-line"
          key={quote}
        >
          {'\u201C'}
          {quote}
          {'\u201D'}
        </p>
      ))}
      {href && (
        <span className="mt-4 flex items-center gap-0.5 text-[0.65rem] text-h2026-muted transition-colors duration-200 ease-out group-hover:text-h2026-green">
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
