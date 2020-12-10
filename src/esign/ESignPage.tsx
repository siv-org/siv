import { useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from './Footer'

type Pad = {
  clear: () => void
}

export const ESignPage = (): JSX.Element => {
  const signaturePad = useRef<Pad>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        <p>
          This vote is intended exclusively <b>David Ernst</b>. Sign your name in the box below.
        </p>
        <SignaturePad redrawOnResize ref={signaturePad} />
        <div className="buttons">
          <button onClick={() => signaturePad.current?.clear() || setSubmitted(false)}>Clear</button>
          <button onClick={() => setSubmitted(true)}>Submit</button>
        </div>
        {submitted && <p style={{ float: 'right' }}>Just a demo 🙂</p>}
        <Footer />
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
