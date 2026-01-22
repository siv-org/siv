import Image from 'next/image'
import { Fragment } from 'react'

import { research } from './research'

export const AcademicResearchPapers = () => (
  <main className="mx-auto mb-8 w-full max-w-screen-lg">
    {/* Crypto Research */}
    {research.map(({ group, papers }) => (
      <div key={group}>
        <h4 className="flex mt-20 text-lg">
          <div className="inline-block w-12 bg-black h-0.5 my-auto mr-2.5" />
          {group}
        </h4>

        <div className="flex flex-wrap justify-between sm:justify-start sm:flex-nowrap group">
          {papers?.map(({ affiliation, authors, cover, name, year }) => (
            <div className="text-center max-w-[180px] sm:mr-[6vw] paper w-[40%] sm:w-auto" key={authors.join('')}>
              <h3>{year}</h3>
              <div className="img-container">{cover && <Image alt={name} fill src={cover} style={{ objectFit: 'contain' }} />}</div>
              <p className="italic font-semibold">{name}</p>
              <p>
                <span className="text-gray-400">by </span>
                {authors.map((author, i) => (
                  <Fragment key={author}>
                    {author}
                    {i < authors.length - 1 && <span> & </span>}
                  </Fragment>
                ))}
              </p>
              <p className="text-[11px]">{affiliation}</p>
            </div>
          ))}
        </div>
      </div>
    ))}

    <style jsx>{`
      .img-container {
        box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3);
        position: relative;
        width: 100%;
        aspect-ratio: 1;
      }
    `}</style>
  </main>
)
