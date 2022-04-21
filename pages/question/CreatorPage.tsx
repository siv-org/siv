import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

/*
v2 authentication:
- How can people identify themselves?
  - [ ] Verify email
  - [ ] Verify phone_num via Signal
  - [ ] Pick a pseudonym
  - [ ] show IP Geolocation
*/

const title = 'SIV Question Creator'
const default_required = 3

const BASE = Math.log(10)
const default_slider = Math.log(default_required) / BASE

export const CreatorPage = () => {
  const [slider, setSlider] = useState(default_slider)
  const [required, setRequired] = useState(default_required)
  const [question, setQuestion] = useState('')
  const { push } = useRouter()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content="Secure anonymous polling" property="og:description"></meta>
      </Head>
      <main>
        <div className="top">
          <h1>{title}</h1>
          <h5>Strong privacy + Verifiability</h5>
          <h3>Your question:</h3>
          <textarea
            placeholder="I want to know..."
            value={question}
            onInput={({ currentTarget }) => setQuestion(currentTarget.value)}
          />

          <h3>
            Min answers required to unlock? <span>For privacy</span>
          </h3>
          <div className="range-container">
            <input
              max="3"
              min="0"
              step="any"
              type="range"
              value={slider}
              onInput={({ currentTarget }) => {
                const s = +currentTarget.value
                setSlider(s)
                setRequired(Math.round(10 ** s))
              }}
            />
            <input
              type="number"
              value={required}
              onInput={({ currentTarget }) => {
                const r = parseInt(currentTarget.value, 10)
                setRequired(r)
                setSlider(Math.log((r || 0) + 1) / BASE)
              }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            // await DKG(admin@siv, creator)

            const default_question = 'What is the meaning of life?'
            push(`?q=${encodeURIComponent(question || default_question)}&req=${required}`)
          }}
        >
          Create Question
        </button>

        <style jsx>{`
          main {
            padding: 4vw;
            min-height: 100vh;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          h1 {
            font-size: 8vw;
            margin-bottom: 0;
          }

          h5 {
            opacity: 0.6;
            margin-top: 0;
            font-size: 4vw;
          }

          h3 {
            font-size: 5vw;
            margin-bottom: 1vw;
          }

          h3 span {
            display: block;
            font-size: 4vw;
            opacity: 0.6;
          }

          textarea {
            width: 100%;
            min-height: 24vw;
            resize: vertical;

            padding: 8px 10px;
            font-size: 4vw;

            border-radius: 5px;
            border: 1px solid #aaa;
          }

          .range-container {
            display: flex;
            justify-content: space-between;
          }

          input[type='range'] {
            flex: 1;
            margin-right: 5%;
            cursor: pointer;
          }

          input[type='number'] {
            width: ${4 * Math.floor(slider) + 14}%;
            font-size: 6vw;
            padding: 10px 3px;
            cursor: pointer;
          }

          button {
            margin-top: 20vw;

            font-size: 4.3vw;
            padding: 9px 10px;
            width: 100%;

            background-color: #dff6ff;
            border: 2px solid #00b4ff;
            border-radius: 7px;

            color: #000a;
            font-weight: 700;
            letter-spacing: 0.5vw;

            cursor: pointer;
          }

          button:hover {
            background-color: #f1fafe;
          }
        `}</style>
      </main>
    </>
  )
}
