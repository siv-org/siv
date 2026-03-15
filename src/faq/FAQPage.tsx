import { LinkOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { Footer } from 'src/homepage2026/Footer'
import { Nav } from 'src/homepage2026/Nav'
import { useAnalytics } from 'src/useAnalytics'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { h26fonts } from '../homepage2026/fonts'
import { AddYourQuestion } from './AddYourQuestion'
import { faq } from './faq'

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

  const systemFont =
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'

  return (
    <>
      <Head title="FAQ" />

      <div className={h26fonts}>
        <Nav />
        <main>
          <div className="faq-content-font">
        <section>
          <h1>Frequently Asked Questions</h1>
          <div className="button-container">
            <OnClickButton
              onClick={() => {
                const update = [...expanded].fill(any_collapsed)
                setExpanded(update)
              }}
              style={{ margin: 0, padding: '5px 15px', textAlign: 'right' }}
            >
              <>{any_collapsed ? 'Expand' : 'Collapse'} all</>
            </OnClickButton>
          </div>

          {faq.map(({ deprecated_ids, id, q, resp }, index) => (
            <div className="question" key={index}>
              {deprecated_ids && deprecated_ids.map((id) => <div id={id} key={id} />)}
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

              {expanded[index] && (
                <>
                  <p dangerouslySetInnerHTML={{ __html: resp }} />

                  {id && (
                    <p className="permalink-row">
                      <a className="permalink" href={`#${id}`}>
                        <LinkOutlined /> #{id}
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
          ))}

          <AddYourQuestion />
        </section>
          </div>

          <Footer />
        </main>
      </div>

      <style global jsx>{`
        a {
          font-weight: bold;
        }
        /* Reset global link styles for 2026 footer so it matches other pages */
        main footer a {
          color: #6b6b6b;
          font-weight: normal;
          text-decoration: none;
        }
        main footer a:hover,
        main footer a:focus,
        main footer a:active {
          color: #1a1a1a;
          text-decoration: none;
        }
        .faq-content-font {
          font-family: ${systemFont};
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

        .permalink-row {
          width: 100%;
          text-align: right;
          padding-top: 0px;
          padding-bottom: 5px;
        }

        .permalink {
          display: inline-block;
          padding: 3px 5px;
          color: black;
          opacity: 0.5;
          font-weight: 400;
          text-align: right;
        }

        label {
          margin-left: 20px;
          width: 11px;
          cursor: pointer;
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
