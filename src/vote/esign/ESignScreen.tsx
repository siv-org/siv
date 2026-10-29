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

      <section className="mx-auto w-full max-w-[750px] p-4 text-sm leading-[1.43] tracking-[0.01071em] text-[#222] font-sans">
        <h1 className="mx-0 mb-2 mt-[0.67em] text-[1.375rem] font-bold">Add Your Signature</h1>
        <p className="m-0 mb-[1em]">
          The election manager has requested your esignature. Please sign your name in the box below.
        </p>
        <SignaturePad
          canvasProps={{ className: 'h-[200px] border border-solid border-black' }}
          redrawOnResize
          ref={signaturePad}
        />
        <div className="mt-2.5 flex justify-between">
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
    </>
  )
}
