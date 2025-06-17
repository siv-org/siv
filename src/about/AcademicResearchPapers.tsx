import Image from 'next/image'
import React, { Fragment } from 'react'
import { darkBlue } from 'src/homepage/colors'

import { research } from './research'

export const AcademicResearchPapers = () => (
  <main>
    {/* Crypto Research */}
    {research.map(({ group, papers }) => (
      <div key={group}>
        <h4>
          <div className="horiz-line" />
          {group}
        </h4>

        <div className="group">
          {papers?.map(({ affiliation, authors, cover, name, year }) => (
            <div className="paper" key={authors.join('')}>
              <h3>{year}</h3>
              <div className="img-container">{cover && <Image src={cover} />}</div>
              <p className="name">{name}</p>
              <p className="author">
                <span>by </span>
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
      main {
        max-width: 1220px;
        width: 100%;
        margin: 0 auto 2rem;
      }

      .group {
        display: flex;
      }

      h4 {
        font-size: max(1.9vw, 16px);
        margin-top: 5rem;
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
      }

      .name {
        font-style: italic;
        font-weight: 600;
      }

      .author span {
        color: #0006;
      }

      .affiliation {
        font-size: 11px;
      }
    `}</style>
  </main>
)
