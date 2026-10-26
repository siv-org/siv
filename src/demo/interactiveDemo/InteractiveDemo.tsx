import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { BALLOT_METHODS, BallotMethod, sharedDemoElectionId } from './content'
import { PrimaryButton } from './shared/PrimaryButton'
import { Intro } from './steps/intro/Intro'
import { Invite } from './steps/invite/Invite'

type Session = { auth: string; method: BallotMethod }
type Step = 'intro' | 'invite' | 'results' | 'submitted' | 'vote'

export function InteractiveDemo() {
  const [session, setSession] = useState<null | Session>(null)
  const electionId = session ? sharedDemoElectionId(session.method) : ''
  const [step, setStep] = useState<Step>('intro')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [height, setHeight] = useState(780)
  const [resultsVersion, setResultsVersion] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const previousStep = useRef(step)
  const requestInFlight = useRef(false)
  const [restored, setRestored] = useState(false)
  const stage = step === 'intro' ? -1 : step === 'invite' ? 0 : step === 'results' ? 2 : 1

  // Retain this tab's capability across refreshes; private ballot selections stay inside the voter page.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('siv-shared-backend-demo') || 'null')
      if (
        saved?.session &&
        /^[a-f0-9]{10}$/.test(saved.session.auth) &&
        ['invite', 'results', 'submitted', 'vote'].includes(saved.step) &&
        BALLOT_METHODS.some(({ id }) => id === saved.session.method)
      ) {
        setSession({ auth: saved.session.auth, method: saved.session.method })
        setStep(saved.step)
      }
    } catch {
      /* Storage may be unavailable; the current in-memory session still works. */
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      if (session) sessionStorage.setItem('siv-shared-backend-demo', JSON.stringify({ session, step }))
      else sessionStorage.removeItem('siv-shared-backend-demo')
    } catch {
      /* Storage may be unavailable. */
    }
  }, [restored, session, step])

  // Changing steps does not load a new page, so the browser needs to be scrolled to the top manually.
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    page.current?.scrollIntoView({ block: 'start' })
  }, [step])

  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      const message = event.data
      if (message?.channel !== 'siv-backend-demo' || message.election_id !== electionId) return
      if (message.type === 'resize' && Number.isFinite(message.height))
        setHeight(Math.max(350, Math.min(6000, message.height)))
      if (message.type === 'submitted') setStep((current) => (current === 'vote' ? 'submitted' : current))
    }
    window.addEventListener('message', listen)
    return () => window.removeEventListener('message', listen)
  }, [electionId])

  async function register(method: BallotMethod = 'plurality', destination: Step = 'invite') {
    if (requestInFlight.current) return
    requestInFlight.current = true
    setBusy(true)
    setError('')
    if (destination === 'invite') setStep('invite')
    try {
      const response = await fetch('/api/demo/mint-auth-token', {
        body: JSON.stringify({ method }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Could not start the demo. Please try again.')
      }
      const data = await response.json()
      setSession({ auth: data.auth, method })
      setHeight(780)
      setStep(destination)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not start the demo.')
    } finally {
      requestInFlight.current = false
      setBusy(false)
    }
  }

  async function openResults() {
    if (!session || requestInFlight.current) return
    requestInFlight.current = true
    setBusy(true)
    setError('')
    try {
      const response = await fetch(`/api/demo/${electionId}/unlock-results`, {
        method: 'POST',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Could not refresh election results. Please try again.')
      }
      setResultsVersion((version) => version + 1)
      setStep('results')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not open demo results.')
    } finally {
      requestInFlight.current = false
      setBusy(false)
    }
  }

  const title =
    step === 'intro'
      ? 'SIV Demo'
      : step === 'invite'
      ? 'Invitation'
      : step === 'results'
      ? 'Results'
      : step === 'vote'
      ? 'Mark your ballot'
      : null
  const voteUrl = session ? `/election/${electionId}/vote?auth=${session.auth}&demo=1` : ''

  return (
    <div aria-busy={busy} ref={page}>
      <ol className="flex mb-8 w-full">
        {['Start demo', 'Receive invite', 'Vote', 'Verify results'].map((label, index) => {
          const active = index === stage + 1
          return (
            <li className="flex relative flex-col flex-1 items-center min-w-0" key={label}>
              {index < 3 && <span aria-hidden className="absolute left-1/2 top-3.5 h-px w-full bg-black/10" />}
              <button
                aria-current={active ? 'step' : undefined}
                className="flex relative flex-col gap-2 items-center"
                disabled={busy || (index > 0 && !session) || (index === 3 && step !== 'results')}
                onClick={() => {
                  setError('')
                  if (index === 0) {
                    setSession(null)
                    setStep('intro')
                  } else if (index === 1) setStep('invite')
                  else if (index === 2) setStep(step === 'results' || step === 'submitted' ? 'submitted' : 'vote')
                  else setStep('results')
                }}
                type="button"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full border bg-h26-bg text-xs ${
                    active ? 'border-h26-green text-h26-green' : 'border-black/15 text-h26-muted'
                  }`}
                >
                  {index === 0 ? <Play size={12} /> : index}
                </span>
                <span className={`text-[0.7rem] sm:text-[0.8rem] ${active ? 'text-h26-text' : 'text-h26-muted'}`}>
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="mx-auto max-w-4xl">
        <header className="mb-5 sm:mb-6">
          {step !== 'intro' && (
            <p className="font-mono26 mb-2 text-[10px] uppercase tracking-[0.16em] text-h26-muted">Interactive Demo</p>
          )}
          {title && (
            <h1
              className={`font-serif26 font-normal tracking-tight text-h26-text ${
                step === 'intro' ? 'text-[clamp(1.15rem,2.4vw,1.45rem)] leading-snug' : 'text-[clamp(1.35rem,5vw,2.1rem)]'
              }`}
            >
              {title}
            </h1>
          )}
          {step === 'intro' && (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-h26-textSecondary sm:text-[0.95rem]">
              Experience the Secure Internet Voting Protocol as a voter, &amp; explore how it handles attacks.
            </p>
          )}
          {step === 'invite' && (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-h26-textSecondary sm:text-[0.95rem]">
              Your election admin sent you a one-time Voter Code via postal mail. Each registered voter gets one.
            </p>
          )}
        </header>
        {step === 'intro' && (
          <div className="rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] sm:p-8">
            <Intro onStart={() => register()} />
          </div>
        )}
        {step === 'invite' && (
          <div className="p-4 sm:p-8">
            <Invite auth={session?.auth || ''} onContinue={() => session && setStep('vote')} />
          </div>
        )}
        {(step === 'vote' || step === 'submitted') && session && (
          <>
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
              <iframe
                className="block w-full border-0"
                height={height}
                key={electionId}
                ref={frame}
                src={voteUrl}
                title="SIV voter interface"
              />
            </div>
            {step === 'vote' && (
              <div className="px-4 mt-6 sm:px-8">
                <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
                  Try other voting methods
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {BALLOT_METHODS.map(({ id, label }) => (
                    <button
                      aria-pressed={session.method === id}
                      className={`rounded-full border px-3 py-1.5 text-[0.72rem] ${
                        session.method === id
                          ? 'border-h26-green/40 bg-h26-green/[0.1] font-medium text-h26-green'
                          : 'border-black/10 text-h26-textSecondary'
                      }`}
                      disabled={busy}
                      key={id}
                      onClick={() => id !== session.method && register(id, 'vote')}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 'submitted' && (
              <div className="flex justify-end mt-6">
                <PrimaryButton disabled={busy} onClick={openResults}>
                  {busy ? 'Opening results…' : 'View results'}
                </PrimaryButton>
              </div>
            )}
          </>
        )}
        {step === 'results' && session && (
          <>
            <iframe
              className="block h-[1000px] w-full rounded-2xl border border-black/10 bg-white"
              key={`${electionId}-${resultsVersion}`}
              src={`/election/${electionId}`}
              title="SIV election results"
            />
            <div className="flex flex-wrap gap-3 justify-end mt-6">
              <PrimaryButton
                disabled={busy}
                onClick={() => {
                  setSession(null)
                  setStep('intro')
                }}
              >
                Start again
              </PrimaryButton>
            </div>
          </>
        )}
        {busy && step !== 'invite' && (
          <p className="mt-4 text-sm text-h26-textSecondary" role="status">
            Please wait…
          </p>
        )}
        {error && (
          <div className="mt-4" role="alert">
            <p className="text-sm text-red-700">{error}</p>
            {step === 'invite' && !session && (
              <PrimaryButton className="mt-3" onClick={() => register()}>
                Try again
              </PrimaryButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
