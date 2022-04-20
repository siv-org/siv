import Image from 'next/image'
import React, { Fragment } from 'react'
import { darkBlue } from 'src/homepage/colors'

import { research } from './research'
import { Team } from './Team'

export const Content = () => (
  <main>
    {/* Crypto Research */}
    <div>
      {research.map(({ group, papers }) => (
        <div key={group}>
          <h4>
            <div className="horiz-line" />
            {group}
          </h4>

          <div className="group">
            {papers?.map(({ authors, cover, name, year }) => (
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <br />
    <br />
    <br />
    <br />

    <Team />

    <style jsx>{`
      main {
        max-width: 1020px;
        width: 100%;
        margin: 10rem auto 2rem;
      }

      .group {
        display: flex;
      }

      h4 {
        font-size: 20px;
      }

      h4 .horiz-line {
        display: inline-block;
        width: 50px;
        height: 2px;
        background: ${darkBlue};

        position: relative;
        bottom: 6px;

        margin-right: 10px;
      }

      .paper {
        text-align: center;
        max-width: 180px;
        margin-right: 6vw;
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
    `}</style>
  </main>
)
