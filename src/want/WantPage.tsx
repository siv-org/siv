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
  const [selected, setSelected] = useState<'Yes' | 'No'>()
  const [id, setId] = useState<string>()
  useRedirect('/do-you-want-siv')

  return (
    <>
      <Head title="Do you want SIV?" />

      <main>
        <Headerbar />
        <section>
          {/* 1st page */}
          <p className="aboveQuestion">If your goverment offers you the option:</p>
          <h2>Do you want to use Secure Internet Voting (SIV) to vote in upcoming elections? </h2>
          <div className="btns">
            {['Yes', 'No'].map((label) => (
              <label key={label}>
                <input
                  readOnly
                  checked={selected === label}
                  type="radio"
                  onClick={async () => {
                    setSelected(label as 'Yes' | 'No')
                    const response = await api('citizen-forms/do-you-want-siv', { id, selected: label })
                    const newId = (await response.json()).id
                    setId(newId)
                  }}
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
          max-width: 800px;
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
        }

        .btns {
          display: flex;
          justify-content: space-around;
        }

        .btns label {
          display: flex;
          font-size: 24px;
          align-items: center;
        }

        input[type='radio'] {
          margin-right: 15px;
          transform: scale(1.5);
        }
      `}</style>
    </>
  )
}
