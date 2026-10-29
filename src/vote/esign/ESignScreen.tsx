import * as Sentry from '@sentry/browser'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Dispatch, useEffect, useRef, useState } from 'react'
import SignaturePad from 'react-signature-pad-wrapper'
import { encodeEsignaturePayload, signReplacement } from 'src/crypto/voter-key'

import { OnClickButton } from '../../_shared/Button'
import { api } from '../../api-helper'
import { State } from '../vote-state'

export const ESignScreen = ({
  auth,
  dispatch,
  election_id,
  onSubmit,
  state,
}: {
  auth?: string
  dispatch: Dispatch<Record<string, string>>
  election_id?: string
  onSubmit?: () => void
  state: State
}): JSX.Element => {
  const signaturePad = useRef<SignaturePad>(null)
  const [buttonText, setButtonText] = useState('Submit')
  const [hasSignature, setHasSignature] = useState(false)
  const router = useRouter()
  const privkey = state.voter_privkey

  // Custom submission uses the pad’s own state; the default signed submission flow is unchanged.
  useEffect(() => {
    const pad = signaturePad.current
    if (!onSubmit || !pad) return
    const updateSignature = () => setHasSignature(!pad.isEmpty())
    pad.instance.addEventListener('endStroke', updateSignature)
    updateSignature()
    return () => pad.instance.removeEventListener('endStroke', updateSignature)
  }, [onSubmit])

  return (
    <>
      {!onSubmit && (
        <Head>
          <title key="title">SIV: Add Your Signature</title>
        </Head>
      )}

      <section>
        <h1>Add Your Signature</h1>
        <p>The election manager has requested your esignature. Please sign your name in the box below.</p>
        <SignaturePad redrawOnResize ref={signaturePad} />
        <div className="buttons">
          <OnClickButton
            onClick={() => {
              signaturePad.current?.clear()
              setHasSignature(false)
              setButtonText('Submit')
            }}
            style={{ marginLeft: 0 }}
          >
            Clear
          </OnClickButton>
          <OnClickButton
            disabled={onSubmit ? !hasSignature : !privkey}
            onClick={async () => {
              // An explicit override replaces submission entirely, so previews never call the API.
              if (onSubmit) return onSubmit()
              setButtonText('Submitting...')
              const esignature = signaturePad.current?.toDataURL()
              // console.log('esignature:', esignature)

              if (auth === 'link') auth = router.query.link_auth as string | undefined
              if (!auth || !election_id || !esignature || !privkey) return setButtonText('Error')

              const signature = await signReplacement(
                privkey,
                encodeEsignaturePayload({ auth, election_id, esignature }),
              )
              const response = await api('submit-esignature', { auth, election_id, esignature, signature })
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
      </section>

      <style jsx>{`
        section :global(canvas) {
          border: 1px solid black;
          height: 200px;
        }

        section {
          color: #222;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
          font-size: 0.875rem;
          letter-spacing: 0.01071em;
          line-height: 1.43;
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          font-size: 1.375rem;
          font-weight: bold;
          margin: 0.67em 0 0.5rem;
        }

        p {
          margin: 0 0 1em;
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
    </>
  )
}
