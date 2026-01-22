import Image from 'next/image'
import { Fragment } from 'react'
import { darkBlue } from 'src/homepage/colors'

import { research } from './research'

export const AcademicResearchPapers = () => (
  <main className="mx-auto mb-8 w-full max-w-screen-lg">
    {/* Crypto Research */}
    {research.map(({ group, papers }) => (
      <div key={group}>
        <h4 className="flex mt-20 text-lg">
          <div className="horiz-line" />
          {group}
        </h4>

        <div className="group">
          {papers?.map(({ affiliation, authors, cover, name, year }) => (
            <div className="paper" key={authors.join('')}>
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
              <p className="affiliation">{affiliation}</p>
            </div>
          ))}
        </div>
      </div>
    ))}

    <style jsx>{`
      .group {
        display: flex;
      }

      h4 .horiz-line {
        display: inline-block;
        width: 50px;
        height: 2px;
        background: ${darkBlue};

        margin: auto 0;
        margin-right: 10px;
      }

      .paper {
        text-align: center;
        max-width: 180px;
        margin-right: 6vw;
      }
      /* 2-column for small screens */
      @media (max-width: 700px) {
        .group {
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .paper {
          width: 40%;
          margin: 0;
        }
      }

      .img-container {
        box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3);
        position: relative;
        width: 100%;
        aspect-ratio: 1;
      }

      .affiliation {
        font-size: 11px;
      }
    `}</style>
  </main>
)
