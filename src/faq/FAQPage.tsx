import { LinkOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { Footer } from 'src/homepage2026/Footer'
import { Nav } from 'src/homepage2026/Nav'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { useAnalytics } from 'src/useAnalytics'

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

  return (
    <div className={`antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head title="FAQ" />

      <Nav />
      <main className="!pt-24">
        <section>
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          <div className="mb-4 text-right">
            <OnClickButton
              onClick={() => {
                const update = [...expanded].fill(any_collapsed)
                setExpanded(update)
              }}
              style={{ fontSize: '14px', margin: 0, padding: '5px 15px', textAlign: 'right' }}
            >
              <>{any_collapsed ? 'Expand' : 'Collapse'} all</>
            </OnClickButton>
          </div>

          {faq.map(({ deprecated_ids, id, q, resp }, index) => (
            <div className="question" key={index}>
              {deprecated_ids && deprecated_ids.map((id) => <div id={id} key={id} />)}
              <h3
                className="text-[16px] font-semibold"
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

        <Footer />
      </main>
      <TailwindPreflight />

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
    </div>
  )
}
