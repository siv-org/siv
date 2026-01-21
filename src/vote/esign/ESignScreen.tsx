import * as Sentry from '@sentry/browser'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Dispatch, useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'

import { OnClickButton } from '../../_shared/Button'
import { api } from '../../api-helper'
import { GlobalCSS } from '../../GlobalCSS'

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
  const router = useRouter()

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
            onClick={() => signaturePad.current?.clear() || setButtonText('Submit')}
            style={{ marginLeft: 0 }}
          >
            Clear
          </OnClickButton>
          <OnClickButton
            onClick={async () => {
              setButtonText('Submitting...')
              const esignature = signaturePad.current?.toDataURL()
              // console.log('esignature:', esignature)

              if (auth === 'link') auth = router.query.link_auth as string | undefined
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
                  level: 'error',
                })
              }
            }}
            style={{ marginRight: 0 }}
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
