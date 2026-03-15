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

      <main className="overflow-hidden p-4 pt-24 w-full">
        <section className="max-w-[750px] mx-auto mb-10">
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>

          {/* Expand/collapse all button */}
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
            // Each item
            <div className="mb-12 border border-black/15" key={index}>
              {deprecated_ids && deprecated_ids.map((id) => <div id={id} key={id} />)}

              {/* Question title */}
              <h3
                className="text-[16px] font-semibold bg-gray-700/10 hover:bg-black/10 p-4 cursor-pointer flex justify-between"
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
                <label className="ml-5 w-[11px] cursor-pointer">{!expanded[index] ? '+' : '–'}</label>
              </h3>

              {/* Expanded content */}
              {expanded[index] && (
                <>
                  <p className="p-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: resp }} />

                  {/* Permalink */}
                  {id && (
                    <p className="pr-5 pb-2 text-right">
                      <a className="font-normal text-black/50 hover:text-black/70" href={`#${id}`}>
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
        main a {
          font-weight: bold;
          color: #1c72d7;
        }
        main a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
