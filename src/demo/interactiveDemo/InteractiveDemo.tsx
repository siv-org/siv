import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { BALLOT_METHODS, BallotMethod, sharedDemoElectionId } from './content'
import { PrimaryButton } from './shared/PrimaryButton'
import { StartNewBallotBtn } from './StartNewBallotBtn'
import { Intro } from './steps/intro/Intro'
import { Invite } from './steps/invite/Invite'
import { VerifyResults } from './steps/verify/VerifyResults'
import { isStep, Step, useDemoNavigation } from './useDemoNavigation'

type Session = { auth: string; method: BallotMethod; submitted?: boolean }

export function InteractiveDemo() {
  const { isReady, setStep, step, urlStep } = useDemoNavigation()
  const [session, setSession] = useState<null | Session>(null)
  const electionId = session ? sharedDemoElectionId(session.method) : ''
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [height, setHeight] = useState(780)
  const [resultsVersion, setResultsVersion] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const previousStep = useRef(step)
  const requestInFlight = useRef(false)
  const [restored, setRestored] = useState(false)
  const stage = ['intro', 'invite', 'vote', 'results'].indexOf(step)

  // Retain this tab's capability across refreshes; private ballot selections stay inside the voter page.
  useEffect(() => {
    if (!isReady || restored) return
    let restoredStep: Step = 'intro'
    const query = new URLSearchParams(window.location.search)
    const auth = query.get('auth') || ''
    const method = BALLOT_METHODS.find(({ id }) => id === query.get('method'))?.id
    // A scanned invitation carries the session to a different device.
    if (urlStep === 'vote' && /^[a-f0-9]{10}$/.test(auth) && method) {
      setSession({ auth, method })
      setStep('vote', 'replace')
      setRestored(true)
      return
    }
    try {
      const saved = JSON.parse(sessionStorage.getItem('siv-shared-backend-demo-v5') || 'null')
      if (
        saved?.session &&
        /^[a-f0-9]{10}$/.test(saved.session.auth) &&
        BALLOT_METHODS.some(({ id }) => id === saved.session.method)
      ) {
        setSession({
          auth: saved.session.auth,
          method: saved.session.method,
          submitted: saved.session.submitted || saved.step === 'submitted' || saved.step === 'results',
        })
        restoredStep = urlStep || (saved.step === 'submitted' ? 'results' : isStep(saved.step) ? saved.step : 'intro')
      }
    } catch {
      /* Storage may be unavailable; the current in-memory session still works. */
    }
    setStep(restoredStep, 'replace')
    setRestored(true)
  }, [isReady, restored, setStep, urlStep])

  useEffect(() => {
    if (!restored) return
    try {
      if (session) sessionStorage.setItem('siv-shared-backend-demo-v5', JSON.stringify({ session, step }))
      else sessionStorage.removeItem('siv-shared-backend-demo-v5')
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
      if (message.type === 'submitted' && step === 'vote' && !session?.submitted) {
        setSession((current) => current && { ...current, submitted: true })
        setStep('results')
      }
    }
    window.addEventListener('message', listen)
    return () => window.removeEventListener('message', listen)
  }, [electionId, session?.submitted, setStep, step])

  async function register(method: BallotMethod = 'plurality', destination: Step = 'invite') {
    if (requestInFlight.current) return
    requestInFlight.current = true
    const sourceUrl = window.location.href
    setBusy(true)
    setError('')
    if (destination === 'invite') {
      setSession(null)
      setStep('invite')
    }
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
      setResultsVersion(0)
      setHeight(780)
      if (destination !== 'invite' && window.location.href === sourceUrl) setStep(destination)
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
    const sourceUrl = window.location.href
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
      if (window.location.href === sourceUrl) setResultsVersion((version) => version + 1)
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
      ? 'Voter Invitation'
      : step === 'results'
      ? 'Verify Results'
      : session?.submitted
      ? 'You already cast a vote.'
      : 'Mark your ballot'
  const voteUrl = session ? `/election/${electionId}/vote?auth=${session.auth}&demo=1` : ''
  const voterPage = (
    <iframe
      className="block w-full border-0"
      height={height}
      key={voteUrl}
      ref={frame}
      src={voteUrl}
      title="SIV voter interface"
    />
  )

  return (
    <div aria-busy={busy} ref={page}>
      <ol className="flex mb-8 w-full">
        {['Start demo', 'Receive invite', 'Vote', 'Verify results'].map((label, index) => {
          const active = index === stage
          const completed = index < stage
          return (
            <li className="flex relative flex-col flex-1 items-center min-w-0" key={label}>
              {index < 3 && (
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-3.5 h-px w-full ${completed ? 'bg-[#b7cdbd]' : 'bg-black/10'}`}
                />
              )}
              <button
                aria-current={active ? 'step' : undefined}
                className="flex relative flex-col gap-2 items-center"
                disabled={busy || (index > 0 && !session) || (index === 3 && !session?.submitted)}
                onClick={() => {
                  setError('')
                  if (index === 0) setStep('intro')
                  else if (index === 1) setStep('invite')
                  else if (index === 2) setStep('vote')
                  else setStep('results')
                }}
                type="button"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full border text-xs ${
                    completed || active
                      ? 'border-[#b7cdbd] bg-[#e6efe8] text-h26-green'
                      : 'border-black/15 bg-h26-bg text-h26-muted'
                  }`}
                >
                  {index === 0 ? <Play size={12} /> : index}
                </span>
                <span
                  className={`text-[0.7rem] sm:text-[0.8rem] ${
                    active || completed ? 'text-h26-text' : 'text-h26-muted'
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className={`mx-auto ${step === 'results' ? '' : 'max-w-4xl'}`}>
        <header className="mb-5 sm:mb-6">
          {/* Align the heading and optional action; wrap on narrow screens. */}
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0 sm:gap-y-3">
            <h1
              className={`font-serif26 font-normal tracking-tight text-h26-text ${
                step === 'intro'
                  ? 'text-[clamp(1.15rem,2.4vw,1.45rem)] leading-snug'
                  : 'text-[clamp(1.35rem,5vw,2.1rem)]'
              }`}
            >
              {title}
            </h1>
            {/* After submission, let demo voters start a fresh ballot with a new voter code. */}
            {step === 'vote' && session?.submitted && (
              <StartNewBallotBtn disabled={busy} onClick={() => register(session.method, 'vote')} />
            )}
          </div>
          {step === 'intro' && (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-h26-textSecondary sm:text-[0.95rem]">
              Experience the Secure Internet Voting Protocol as a voter, &amp; explore how it handles attacks.
            </p>
          )}
          {step === 'invite' && (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-h26-textSecondary sm:text-[0.95rem]">
              Each eligible voter is pre-assigned a unique, one-time Voter Code to access their ballot. Election
              administrators choose how voters gain access and which identity checks are required.
            </p>
          )}
        </header>
        {error && (
          <div className="mb-4" role="alert">
            <p className="text-sm text-red-700">{error}</p>
            {step === 'invite' && !session && (
              <PrimaryButton className="mt-3" onClick={() => register()}>
                Try again
              </PrimaryButton>
            )}
          </div>
        )}
        {step === 'intro' && (
          <div className="rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] sm:p-8">
            <Intro onStart={() => register()} />
          </div>
        )}
        {step === 'invite' && (
          <div className="p-4 sm:p-8">
            <Invite
              auth={session?.auth || ''}
              onContinue={() => session && setStep('vote')}
              voteLink={session ? `/demo?vote&auth=${session.auth}&method=${session.method}` : ''}
            />
          </div>
        )}
        {step === 'vote' && session && (
          <>
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">{voterPage}</div>
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
          </>
        )}
        {step === 'results' && session && (
          <VerifyResults
            busy={busy}
            electionId={electionId}
            onOpenResults={openResults}
            onRestart={() => setStep('intro')}
            receipt={voterPage}
            resultsVersion={resultsVersion}
          />
        )}
        {busy && step !== 'invite' && (
          <p className="mt-4 text-sm text-h26-textSecondary" role="status">
            Please wait…
          </p>
        )}
      </div>
    </div>
  )
}
