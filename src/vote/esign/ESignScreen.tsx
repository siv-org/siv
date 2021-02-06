import Head from 'next/head'
import { useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'

import { GlobalCSS } from '../../GlobalCSS'
import { OnClickButton } from '../../landing-page/Button'

type Pad = {
  clear: () => void
  toDataURL: () => string
}

export const ESignScreen = (): JSX.Element => {
  const signaturePad = useRef<Pad>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Head>
        <title key="title">SIV: Add Your Signature</title>
      </Head>

      <main>
        <h1>Add Your Signature</h1>
        <p>The election manager has requested your esignature. Please sign your name in the box below.</p>
        <SignaturePad redrawOnResize ref={signaturePad} />
        <div className="buttons">
          <OnClickButton style={{ marginLeft: 0 }} onClick={() => signaturePad.current?.clear() || setSubmitted(false)}>
            Clear
          </OnClickButton>
          <OnClickButton
            style={{ marginRight: 0 }}
            onClick={() => {
              setSubmitted(true)
              const data = signaturePad.current?.toDataURL()
              console.log('data:', data)
            }}
          >
            Submit
          </OnClickButton>
        </div>
        {submitted && <p style={{ float: 'right' }}>Just a demo 🙂</p>}
      </main>

      <style global jsx>{`
        canvas {
          border: 1px solid black;
          height: 200px;
        }
      `}</style>
      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        .buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        button {
          font-size: 13px;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
