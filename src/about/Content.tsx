import Image from 'next/image'

import { research } from './research'
import { Team } from './Team'

export const Content = () => (
  <main>
    {/* Crypto Research */}
    <div>
      {research.map(({ group, papers }) => (
        <div key={group}>
          <h4>{group}</h4>

          <div className="group">
            {papers?.map(({ author, cover, name, year }) => (
              <div className="paper" key={author}>
                <h3>{year}</h3>
                <div className="img-container">{cover && <Image src={cover} />}</div>
                <p>{name}</p>
                <p>by {author}</p>
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

      .paper {
        text-align: center;
        max-width: 180px;
        margin-right: 2rem;
      }

      .img-container {
        box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3);
      }
    `}</style>
  </main>
)
