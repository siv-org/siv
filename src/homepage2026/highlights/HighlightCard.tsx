import { Check } from 'lucide-react'

import type { Highlight } from './highlights-data'

export function HighlightCard({ body, items, quote, tag, title, width }: Highlight) {
  return (
    <div
      className={[
        'group flex shrink-0 flex-col rounded-h2026 border border-h2026-border border-t-2 border-t-h2026-green/60 bg-h2026-bgCard p-5',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-t-h2026-green hover:shadow-[0_6px_24px_rgba(26,107,74,0.1)]',
        width,
      ].join(' ')}
    >
      <span className="font-mono2026 text-[0.6rem] uppercase tracking-[0.2em] text-h2026-green">{tag}</span>
      <h3 className="mt-2 font-serif2026 text-[0.95rem] font-normal leading-snug tracking-tight">{title}</h3>
      {body && <p className="mt-2.5 text-[0.8rem] leading-[1.6] text-h2026-textSecondary">{body}</p>}
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
      {quote && (
        <p className="mt-3 border-l-2 border-h2026-green/40 pl-3 font-serif2026 text-[0.8rem] italic leading-[1.6] text-h2026-textSecondary">
          {quote}
        </p>
      )}
    </div>
  )
}
