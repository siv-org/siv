import { useState } from 'react'
import { api } from 'src/api-helper'
import { GlobalCSS } from 'src/GlobalCSS'

import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { Headerbar } from './Headerbar'
import { NoContent } from './NoContent'
import { YesContent } from './YesContent'

export const WantPage = (): JSX.Element => {
  const [selected, setSelected] = useState<'Yes' | 'No'>()
  const [id, setId] = useState<string>()
  return (
    <>
      <Head title="Do you want SIV?" />

      <div>
        <Headerbar />
        <div>
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
                    const response = await api('citizen-forms/do-you-want-siv', { selected: label })
                    const { id } = await response.json()
                    setId(id)
                  }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        {selected === 'Yes' && <YesContent id={id} />}
        {selected === 'No' && <NoContent id={id} />}
        <Footer />
      </div>

      <GlobalCSS />

      <style jsx>{`
        div {
          padding: 1rem 3rem;

          width: 100%;
          overflow-x: hidden;
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
