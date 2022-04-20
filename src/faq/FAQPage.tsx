import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { Footer } from 'src/homepage/Footer'
import { useAnalytics } from 'src/useAnalytics'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AddYourQuestion } from './AddYourQuestion'
import { faq } from './faq'
import { HeaderBar } from './HeaderBar'

export const FAQPage = (): JSX.Element => {
  useAnalytics()
  const [expanded, setExpanded] = useState<boolean[]>(new Array(faq.length).fill(false))
  const any_collapsed = expanded.some((s) => !s)
  const asPath = useRouter()?.asPath

  // Autoexpand faq if following link to specific id
  useEffect(() => {
    const hash = asPath.split('#')[1]
    if (hash) {
      // Find the matching index
      const index = faq.findIndex(({ id }) => id === hash)

      if (index !== -1) {
        const update = [...expanded]
        update[index] = true
        setExpanded(update)
      }
    }
  }, [asPath])

  return (
    <>
      <Head title="FAQ" />

      <HeaderBar />
      <main>
        <section>
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

          {faq.map(({ id, q, resp }, index) => (
            <div className="question" key={index}>
              <h3
                id={id}
                onClick={() => {
                  const update = [...expanded]
                  update[index] = !update[index]
                  setExpanded(update)
                }}
              >
                <span>
                  {index + 1}. {q}
                </span>
                <label>{!expanded[index] ? '+' : '–'}</label>
              </h3>
              {expanded[index] && <p dangerouslySetInnerHTML={{ __html: resp }} />}
            </div>
          ))}

          <AddYourQuestion />
        </section>

        <Footer />
      </main>

      <style global jsx>{`
        a {
          font-weight: bold;
        }
      `}</style>
      <style jsx>{`
        main {
          width: 100%;
          padding: 1rem;
          overflow-x: hidden;
        }

        section {
          max-width: 750px;
          margin: 2rem auto 5rem;
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

        label {
          padding-left: 20px;
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
