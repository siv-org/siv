import { useRef } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from './Footer'

export const ESignPage = (): JSX.Element => {
  const signaturePad = useRef(null)

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        <p>
          This vote is intended exclusively <b>David Ernst</b>. Sign your name in the box below.
        </p>
        <div className="sig-container">
          <SignaturePad redrawOnResize ref={signaturePad} />
        </div>
        <div className="buttons">
          <button onClick={() => signaturePad.current.clear()}>Clear</button>
          <button>Submit</button>
        </div>
        <Footer />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        .sig-container {
          border: 1px solid black;
          height: 200px;
          overflow: hidden;
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
