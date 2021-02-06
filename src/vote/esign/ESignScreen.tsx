import * as Sentry from '@sentry/browser'
import Head from 'next/head'
import { Dispatch, useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'

import { api } from '../../api-helper'
import { GlobalCSS } from '../../GlobalCSS'
import { OnClickButton } from '../../landing-page/Button'

type Pad = {
  clear: () => void
  toDataURL: () => string
}

export const ESignScreen = ({
  auth,
  dispatch,
  election_id,
}: {
  auth?: string
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
}): JSX.Element => {
  const signaturePad = useRef<Pad>(null)
  const [buttonText, setButtonText] = useState('Submit')

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
          <OnClickButton
            style={{ marginLeft: 0 }}
            onClick={() => signaturePad.current?.clear() || setButtonText('Submit')}
          >
            Clear
          </OnClickButton>
          <OnClickButton
            style={{ marginRight: 0 }}
            onClick={async () => {
              setButtonText('Submitting...')
              const esignature = signaturePad.current?.toDataURL()
              console.log('esignature:', esignature)

              const response = await api('submit-esignature', { auth, election_id, esignature })
              if (response.status === 200) {
                dispatch({ esigned_at: new Date().toString() })
              } else {
                setButtonText('Error')
                console.log('response', response)
                const json = await response.json()
                console.log('response.json', json)
                Sentry.captureMessage(json.error, {
                  extra: { auth, election_id, esignature },
                  level: Sentry.Severity.Error,
                })
              }
            }}
          >
            {buttonText}
          </OnClickButton>
        </div>
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
