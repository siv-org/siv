import Image from 'next/image'
import { Fragment } from 'react'

import { research } from './research'

export const AcademicResearchPapers = () => (
  <main className="mx-auto mb-8 w-full max-w-screen-lg">
    {/* Crypto Research */}
    {research.map(({ group, papers }) => (
      <div key={group}>
        {/* Group header */}
        <h4 className="flex gap-3 items-center mt-20 text-lg font-medium tracking-tight text-h26-text">
          <span className="w-12 h-px shrink-0 bg-h26-text" />
          {group}
        </h4>

        {/* Papers */}
        <div className="mt-8 flex flex-wrap justify-between gap-y-10 sm:justify-start sm:flex-nowrap sm:gap-0 sm:gap-x-[6vw]">
          {papers?.map(({ affiliation, authors, cover, name, year }) => (
            <article
              className="w-[40%] min-w-0 max-w-[200px] text-center sm:w-auto sm:max-w-[200px]"
              key={authors.join('')}
            >
              {/* Year */}
              <p className="text-sm tracking-wider font-mono26 text-h26-muted">{year}</p>

              {/* Cover */}
              <div className="mt-2 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.15)]">
                <Image alt="" className="w-full" src={cover} />
              </div>

              {/* Paper title */}
              <p className="mt-3 font-serif26 text-[0.95rem] font-normal text-h26-text">{name}</p>

              {/* Authors */}
              <p className="mt-2 text-[0.8rem] leading-snug text-black/80">
                <span className="text-h26-muted">by </span>
                {authors.map((author, i) => (
                  <Fragment key={author}>
                    {author}
                    {i < authors.length - 1 && <span> & </span>}
                  </Fragment>
                ))}
              </p>

              {/* Affiliation */}
              <p className="mt-2 text-[0.75rem] leading-snug text-h26-textSecondary">{affiliation}</p>
            </article>
          ))}
        </div>
      </div>
    ))}
  </main>
)
