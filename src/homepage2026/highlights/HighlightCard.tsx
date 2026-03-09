import { Check } from 'lucide-react'

import type { Highlight } from './highlights-data'

export function HighlightCard({ body, items, quotes, tag, title, width }: Highlight) {
  return (
    <div
      className={[
        'group flex shrink-0 flex-col rounded-h2026 border border-h2026-border bg-h2026-bgCard p-5',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(26,107,74,0.1)]',
        width,
      ].join(' ')}
    >
      <span className="font-mono2026 text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-h2026-green">
        {tag}
      </span>
      <h3 className="mt-2 font-serif2026 text-[1rem] md:text-[1.1rem] font-normal leading-snug tracking-tight">{title}</h3>
      {body && (
        <p className="mt-2.5 text-[0.85rem] md:text-[0.95rem] leading-[1.6] text-h2026-textSecondary">{body}</p>
      )}
      {items && (
        <ul className="mt-3 grid gap-1.5">
          {items.map((item) => (
            <li className="flex items-start gap-2 text-[0.8rem] md:text-[0.9rem] text-h2026-textSecondary" key={item}>
              <Check className="mt-0.5 size-3 shrink-0 text-h2026-green" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {quotes?.map((quote) => (
        <p
          className="mt-4 border-l-2 border-h2026-green/40 pl-3 font-serif2026 text-[0.85rem] md:text-[0.95rem] italic leading-[1.6] text-h2026-textSecondary whitespace-pre-line"
          key={quote}
        >
          {'\u201C'}
          {quote}
          {'\u201D'}
        </p>
      ))}
    </div>
  )
}
