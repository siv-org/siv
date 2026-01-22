import Image from 'next/image'
import { Fragment } from 'react'

import { research } from './research'

export const AcademicResearchPapers = () => (
  <main className="mx-auto mb-8 w-full max-w-screen-lg">
    {/* Crypto Research */}
    {research.map(({ group, papers }) => (
      <div key={group}>
        {/* Group header */}
        <h4 className="flex mt-20 text-lg">
          <div className="inline-block w-12 bg-black h-0.5 my-auto mr-2.5" />
          {group}
        </h4>

        {/* Papers */}
        <div className="flex flex-wrap justify-between sm:justify-start sm:flex-nowrap group">
          {papers?.map(({ affiliation, authors, cover, name, year }) => (
            <div className="text-center max-w-[180px] sm:mr-[6vw] w-[40%] sm:w-auto" key={authors.join('')}>
              {/* Year */}
              <h3>{year}</h3>

              {/* Image preview */}
              <div className="shadow-[3px_3px_6px_1px_rgba(0,0,0,0.22)]">
                <Image alt="First page image" className="w-full h-full" src={cover} />
              </div>

              {/* Paper title */}
              <p className="italic font-semibold">{name}</p>

              {/* Authors */}
              <p>
                <span className="text-gray-400">by </span>
                {authors.map((author, i) => (
                  <Fragment key={author}>
                    {author}
                    {i < authors.length - 1 && <span> & </span>}
                  </Fragment>
                ))}
              </p>

              {/* Affiliation */}
              <p className="text-[11px]">{affiliation}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </main>
)
