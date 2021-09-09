import { useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { faq } from './faq'
import { HeaderBar } from './HeaderBar'

export const FAQPage = (): JSX.Element => {
  const [expanded, setExpanded] = useState(new Array(faq.length).fill(false))

  return (
    <>
      <Head title="FAQ" />

      <HeaderBar />
      <main>
        <h1>Frequently Asked Questions</h1>
        {faq.map(({ q, resp }, index) => (
          <div key={index}>
            <h3
              onClick={() => {
                const update = [...expanded]
                update[index] = !update[index]
                setExpanded(update)
              }}
            >
              <span>
                {index + 1}. {q}
              </span>
              <span>{!expanded[index] ? '+' : '–'}</span>
            </h3>
            {expanded[index] && <p>{resp}</p>}
          </div>
        ))}
      </main>
      <BlueDivider />
      <Footer />

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 2rem auto;
          padding: 1rem;
        }

        div {
          margin-bottom: 3rem;
          border: 1px solid hsl(0, 0%, 87%);
        }

        h3 {
          background: hsl(0, 0%, 93%);
          margin: 0;
          padding: 1rem;
          cursor: pointer;

          display: flex;
          justify-content: space-between;
        }

        h3:hover {
          background: hsl(0, 0%, 90%);
        }

        p {
          white-space: pre-wrap;
          margin: 0;
          padding: 1rem;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
