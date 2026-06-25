import type { Quote } from './quotes-data'

export function QuoteRow({ author, context, quote }: Quote) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 py-7 md:grid-cols-[160px_1fr] md:py-8">
      {/* Attribution */}
      <span className="font-mono26 text-[0.68rem] uppercase tracking-[0.16em] text-h26-muted md:pt-2">
        {author && <span className="block text-h26-textSecondary">{author}</span>}
        {context}
      </span>

      {/* Quote */}
      <blockquote className="font-serif26 whitespace-pre-line text-[1.05rem] font-normal leading-[1.6] tracking-tight text-h26-text md:text-[1.2rem]">
        “{quote}”
      </blockquote>
    </div>
  )
}
