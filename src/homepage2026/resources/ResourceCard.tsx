import { ArrowUpRight } from 'lucide-react'

import type { Resource } from './resources-data'

export function ResourceCard({ category, description, href, icon: Icon, title }: Resource) {
  const isExternal = href.startsWith('http')

  return (
    <a
      className="flex relative flex-col gap-4 p-7 no-underline border transition-all duration-300 ease-out group rounded-[20px] border-h26-border bg-h26-bgCard text-inherit hover:-translate-y-1 hover:border-h26-borderStrong hover:shadow-h26-lg md:p-8"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex gap-4 justify-between items-start">
        <div className="flex justify-center items-center w-11 h-11 transition-colors duration-300 shrink-0 rounded-[14px] bg-[#f5f4f0] text-h26-textSecondary group-hover:bg-h26-green/10 group-hover:text-h26-green">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="translate-y-0.5 text-h26-muted opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} strokeWidth={2} />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono26 text-[0.65rem] uppercase tracking-[0.18em] text-h26-muted">{category}</span>
        <h3 className="font-serif26 text-[1.15rem] font-normal leading-snug tracking-tight md:text-[1.25rem]">
          {title}
        </h3>
      </div>

      <p className="text-[0.82rem] leading-[1.7] text-h26-textSecondary">{description}</p>

      <div className="pt-2 mt-auto">
        <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-h26-green transition-all duration-200 group-hover:gap-2.5">
          {isExternal ? 'View docs' : 'Explore'}
          <ArrowUpRight
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            size={13}
            strokeWidth={2.5}
          />
        </span>
      </div>
    </a>
  )
}
