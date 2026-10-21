import { useEffect, useRef, useState } from 'react'
import { GlobalCSS } from 'src/GlobalCSS'
import { Ballot } from 'src/vote/Ballot'
import { generateColumnNames } from 'src/vote/generateColumnNames'
import { DetailedEncryptionReceipt } from 'src/vote/submitted/DetailedEncryptionReceipt'
import { EncryptedVote } from 'src/vote/submitted/EncryptedVote'
import { UnlockedVote } from 'src/vote/submitted/UnlockedVote'
import { reducer, State } from 'src/vote/vote-state'

import { initialBallot, Method, Receipt } from './election'

export function VoterFrame() {
  const [state, setState] = useState<null | State>(null)
  const [auth, setAuth] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [forgotten, setForgotten] = useState(false)
  const [checkUrl, setCheckUrl] = useState('')
  const [qr, setQr] = useState('')
  const [practice, setPractice] = useState(false)
  const [overridden, setOverridden] = useState(false)
  const sent = useRef(false)
  const host = useRef<HTMLDivElement>(null)
  const post = (message: Record<string, unknown>) =>
    window.parent.postMessage({ channel: 'siv-demo-2', ...message }, window.location.origin)

  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || window.parent === window) return
      const data = event.data
      if (data?.channel !== 'siv-demo-2') return
      if (data.type === 'init' && !sent.current) {
        setAuth(data.auth)
        setState(initialBallot(data.publicKey, data.method as Method))
      }
      if (data.type === 'accepted') {
        setPending(false)
        setState((prev) => prev && { ...prev, submitted_at: new Date() })
      }
      if (data.type === 'rejected') {
        sent.current = false
        setPending(false)
        setError(data.message)
      }
    }
    window.addEventListener('message', listen)
    post({ type: 'ready' })
    const observer = new ResizeObserver(() => post({ height: host.current?.scrollHeight, type: 'resize' }))
    if (host.current) observer.observe(host.current)
    return () => {
      window.removeEventListener('message', listen)
      observer.disconnect()
    }
  }, [])

  async function makeCheck() {
    if (!state) return
    try {
      const receipt: Receipt = {
        encrypted: state.encrypted,
        public_key: state.public_key,
        randomizer: state.randomizer,
      }
      const url = `${window.location.origin}/demo-2/check#${encodeURIComponent(JSON.stringify(receipt))}`
      const { default: QRCodeStyling } = await import('qr-code-styling')
      const code = new QRCodeStyling({ data: url, height: 240, qrOptions: { errorCorrectionLevel: 'L' }, width: 240 })
      const blob = await code.getRawData('svg')
      if (blob instanceof Blob) {
        const reader = new FileReader()
        reader.onload = () => setQr(String(reader.result))
        reader.readAsDataURL(blob)
      }
      setCheckUrl(url)
    } catch {
      setError('Could not create the check link. Try again.')
    }
  }

  const { columns } = generateColumnNames({ ballot_design: state?.ballot_design })
  return (
    <div className="p-4 sm:p-6" ref={host}>
      <GlobalCSS />
      {!state && !forgotten && (
        <p>
          Preparing your ballot… Open this interface through{' '}
          <a href="/demo-2" target="_top">
            the demo
          </a>
          .
        </p>
      )}
      {forgotten && (
        <div role="status">
          <h2>Private receipt deleted</h2>
          <p>
            Your selections, Verification #, encryption randomizers, and check link have been removed from this
            interface. Your encrypted submission remains on the demo board.
          </p>
          <p>
            Copies you saved or opened on another device must be deleted separately. You can still view the published
            results.
          </p>
        </div>
      )}
      {state && !state.submitted_at && (
        <>
          <h1 className="mt-0 text-2xl font-semibold">Cast Your Vote</h1>
          <p className="mb-5 text-xs text-gray-500">
            Your Voter Code: <span className="font-mono">{auth}</span>
          </p>
          <Ballot dispatch={(payload) => setState((prev) => prev && reducer(prev, payload))} state={state} />
          <div className="flex justify-end mt-6">
            <button
              className="action"
              disabled={pending || !Object.values(state.plaintext).some((v) => v && v !== 'BLANK')}
              onClick={() => {
                if (sent.current) return
                sent.current = true
                setPending(true)
                setError('')
                post({ submission: { at: Date.now(), auth, encrypted: state.encrypted }, type: 'submit' })
              }}
              type="button"
            >
              {pending ? 'Submitting…' : 'Submit vote →'}
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Your choices are encrypted on this device using SIV’s voting code.
          </p>
        </>
      )}
      {state?.submitted_at && (
        <>
          <h1 className="mt-0 text-2xl font-semibold">Vote Submitted.</h1>
          <p>
            Keep your secret Verification #. Once the results open, find it in the published votes and check the choices
            beside it.
          </p>
          <UnlockedVote columns={columns} state={state} />
          <details className="mt-6">
            <summary>How your vote was submitted</summary>
            <p>
              Your voter code accompanies an encrypted ballot. Like a signed outer envelope and a private inner ballot,
              eligibility and ballot contents play different roles.
            </p>
            <EncryptedVote auth={auth} columns={columns} state={state} />
          </details>
          <details className="mt-4">
            <summary>Encryption details and private receipt</summary>
            <div className="mt-3">
              <DetailedEncryptionReceipt auth={auth} election_id="demo-2-local" state={state} />
            </div>
          </details>
          <h2 className="mt-8 text-lg font-semibold">Extra protection, if you need it</h2>
          <p className="text-sm text-gray-500">These are optional. You can continue straight to results.</p>
          <details className="tool">
            <summary>Check with a second device</summary>
            <p>
              Open this private receipt on a device you trust. That device uses the submitted ciphertext and encryption
              randomizer to recover what was encrypted. Compare its selections and Verification # with what you
              intended.
            </p>
            <button className="action" onClick={makeCheck} type="button">
              Create private check link
            </button>
            {checkUrl && (
              <div className="mt-4">
                <p className="text-xs">This link reveals your vote. Keep it private.</p>
                {qr && (
                  <img alt="Scan on a trusted second device to check this receipt" height={240} src={qr} width={240} />
                )}
                <a href={checkUrl} rel="noreferrer" target="_blank">
                  Open independent receipt checker ↗
                </a>
                <p className="text-xs text-gray-500">
                  On a local development server, a second device needs access to this host.
                </p>
              </div>
            )}
          </details>
          <details className="tool">
            <summary>If someone pressures you or offers to buy your vote</summary>
            <p>
              SIV’s Verifiable Private Overrides are designed to let a voter privately replace a coerced vote through a
              separate authorized channel, such as a polling station.
            </p>
            <button
              className="secondary"
              onClick={() => {
                setPractice(!practice)
                setOverridden(false)
              }}
              type="button"
            >
              {practice ? 'Close example' : 'Explore a private-override example'}
            </button>
            {practice && (
              <div className="p-4 mt-4 rounded bg-gray-50">
                <strong>Practice scenario · separate from your ballot</strong>
                <p>
                  A buyer has a receipt for a demanded vote. Later, the voter visits a polling station and privately
                  requests an override.
                </p>
                <button className="secondary" disabled={overridden} onClick={() => setOverridden(true)} type="button">
                  {overridden ? 'Example override recorded' : 'Request an override in this example'}
                </button>
                {overridden && (
                  <p role="status">
                    The coerced vote would be excluded and the authorized replacement counted. A receipt alone cannot
                    establish that a coerced ballot was ultimately counted. This example does not change your demo
                    ballot.
                  </p>
                )}
              </div>
            )}
            <p>
              <a href="https://blog.siv.org/2025/08/overrides" rel="noreferrer" target="_blank">
                Read how Verifiable Private Overrides work ↗
              </a>
            </p>
          </details>
          <details className="tool">
            <summary>Delete private verification information</summary>
            <p>
              Save your Verification # somewhere safe first if you want to verify later. Deleting the private receipt
              does not withdraw your encrypted ballot.
            </p>
            <button
              className="secondary"
              onClick={() => {
                setState(null)
                setCheckUrl('')
                setQr('')
                setForgotten(true)
                setPractice(false)
                setError('')
                post({ type: 'forgotten' })
              }}
              type="button"
            >
              Delete my private receipt
            </button>
          </details>
        </>
      )}
      {error && (
        <p className="text-red-700" role="alert">
          {error}
        </p>
      )}
      <style jsx>{`
        .action {
          background: #215c42;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 600;
        }
        .action:disabled,
        .secondary:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .secondary {
          background: white;
          border: 1px solid #ccd5ce;
          border-radius: 8px;
          padding: 10px 14px;
          cursor: pointer;
        }
        summary {
          cursor: pointer;
          font-weight: 600;
          padding: 8px 0;
        }
        .tool {
          border-top: 1px solid #e3e8e3;
          padding: 12px 0;
        }
      `}</style>
    </div>
  )
}
