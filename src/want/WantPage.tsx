import { useState } from 'react'
import { api } from 'src/api-helper'
import { GlobalCSS } from 'src/GlobalCSS'

import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { FormIntro } from './FormIntro'
import { Headerbar } from './Headerbar'
import { IfNoForm } from './IfNoForm'
import { IfYesForm } from './IfYesForm'
import { useRedirect } from './useRedirect'

export const WantPage = (): JSX.Element => {
  const [selected, setSelected] = useState<'No' | 'Yes'>()
  const [id, setId] = useState<string>()
  useRedirect('/do-you-want-siv')

  return (
    <>
      <Head title="Do you want SIV?" />

      <main>
        <Headerbar />
        <section>
          {/* 1st page */}
          <h2>
            Do you want the option to <b>vote from your phone or computer</b> in upcoming elections?
            <span>
              with <b>strong security</b> and <b>verifiability</b>
            </span>
          </h2>
          <div className="btns">
            {['Yes', 'No'].map((label) => (
              <label key={label}>
                <input
                  checked={selected === label}
                  onClick={async () => {
                    setSelected(label as 'No' | 'Yes')
                    const response = await api('citizen-forms/do-you-want-siv', { id, selected: label })
                    const newId = (await response.json()).id
                    setId(newId)
                  }}
                  readOnly
                  type="radio"
                />
                {label}
              </label>
            ))}
          </div>

          {/* 2nd page */}
          {!!selected && <FormIntro />}
          {selected === 'Yes' && <IfYesForm id={id} />}
          {selected === 'No' && <IfNoForm id={id} />}
        </section>
        <Footer />
      </main>

      <GlobalCSS />

      <style jsx>{`
        main {
          padding: 1rem 3rem;

          width: 100%;
          overflow-x: hidden;
        }

        section {
          max-width: 850px;
          margin: 0 auto 8rem;
        }

        .aboveQuestion {
          text-align: center;
          margin-top: 50px;
          color: grey;
          opacity: 60%;
          font-style: italic;
        }

        h2 {
          text-align: center;
          font-weight: 400;
        }

        @media (min-width: 400px) {
          h2 > b {
            display: block;
          }
        }

        h2 span {
          font-weight: normal;
          display: block;
          margin-top: 0.5rem;
          font-size: 17px;
          color: #666;
        }

        h2 span b {
          color: #222;
          font-weight: 500;
        }

        .btns {
          display: flex;
          justify-content: space-around;
          margin-top: 2rem;
        }

        .btns label {
          display: flex;
          font-size: 24px;
          align-items: center;
          cursor: pointer;
        }

        input[type='radio'] {
          margin-right: 15px;
          transform: scale(1.5);
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
