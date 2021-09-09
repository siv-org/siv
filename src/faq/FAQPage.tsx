import { useState } from 'react'
import { OnClickButton } from 'src/landing-page/Button'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { faq } from './faq'
import { HeaderBar } from './HeaderBar'

export const FAQPage = (): JSX.Element => {
  const [expanded, setExpanded] = useState<boolean[]>(new Array(faq.length).fill(false))
  const any_collapsed = expanded.some((s) => !s)

  return (
    <>
      <Head title="FAQ" />

      <HeaderBar />
      <main>
        <h1>Frequently Asked Questions</h1>
        <div className="button-container">
          <OnClickButton
            style={{ margin: 0, padding: '5px 15px', textAlign: 'right' }}
            onClick={() => {
              const update = [...expanded].fill(any_collapsed)
              setExpanded(update)
            }}
          >
            <>{any_collapsed ? 'Expand' : 'Collapse'} all</>
          </OnClickButton>
        </div>

        {faq.map(({ q, resp }, index) => (
          <div className="question" key={index}>
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
            {expanded[index] && <p dangerouslySetInnerHTML={{ __html: resp }} />}
          </div>
        ))}
      </main>
      <BlueDivider />
      <Footer />

      <style global jsx>{`
        a {
          font-weight: bold;
        }
      `}</style>
      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 2rem auto;
          padding: 1rem;
        }

        .button-container {
          text-align: right;
          margin-bottom: 1rem;
        }

        .question {
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
