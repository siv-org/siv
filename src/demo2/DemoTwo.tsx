import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  Mail,
  Play,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { secretsMatch } from 'src/_shared/secretsMatch'
import { ballotDesignFor } from 'src/demo/interactiveDemo/content'
import { Head } from 'src/Head'
import { h26fonts } from 'src/homepage2026/fonts'
import { Footer } from 'src/homepage2026/Footer'
import { Nav } from 'src/homepage2026/Nav'
import { RoundResults } from 'src/status/RoundResults'
import { tallyVotes } from 'src/status/tally-votes'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { generateColumnNames } from 'src/vote/generateColumnNames'

import { acceptSubmission, createElection, detectionSample, Election, Method, unlockElection } from './election'

const STAGES = ['The overview', 'Identify voters', 'Cast a vote', 'Verify results']
const TITLES = [
  'A simple vote.\nA result you can verify.',
  'Every election starts with people.',
  'Now, you’re the voter.',
  'Your vote is in. Your choices stay private.',
  'The results are open. Check for yourself.',
]
const DESCRIPTIONS = [
  'Experience Secure Internet Voting from invitation to verified result. A few minutes. One complete election.',
  'Who is eligible, and how do they get access? Different elections can answer those questions in different ways.',
  'Use the SIV ballot below. Make your selection and submit, just as a voter would.',
  'Your device encrypted your ballot. Your Voter Code lets it be accepted once; your secret Verification # lets you find it later.',
  'Check the outcome, find your own vote, and explore how an election can be audited.',
]

export function DemoTwo() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [method, setMethod] = useState<Method>('plurality')
  const [election, setElection] = useState<Election | null>(null)
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [height, setHeight] = useState(650)
  const [search, setSearch] = useState('')
  const [receiptDeleted, setReceiptDeleted] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [risk, setRisk] = useState(0.05)
  const iframe = useRef<HTMLIFrameElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const currentElection = useRef<Election | null>(null)
  const submitted = !!election?.submissions.some((v) => secretsMatch(v.auth, election.auth))
  const stage = step === 4 ? 3 : step === 3 ? 2 : step
  const design = ballotDesignFor(election?.method || method)
  const { columns } = generateColumnNames({ ballot_design: [design] })
  const { ordered, tallies } = tallyVotes({ vote: design }, rows)
  const ranking = (ordered.vote || []).filter((candidate) => candidate !== 'BLANK')
  const margin =
    rows.length && ranking.length > 1
      ? ((tallies.vote[ranking[0]] || 0) - (tallies.vote[ranking[1]] || 0)) / rows.length
      : 0
  const sample = detectionSample(margin, risk)
  const found = search ? rows.find((row) => row.tracking.replace(/\D/g, '') === search.replace(/\D/g, '')) : undefined

  useEffect(() => {
    if (step > 0) {
      window.scrollTo(0, 0)
      heading.current?.focus({ preventScroll: true })
    }
  }, [step])

  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return
      const data = event.data
      const active = currentElection.current
      if (data?.channel !== 'siv-demo-2' || !active) return
      const reply = (message: Record<string, unknown>) =>
        iframe.current?.contentWindow?.postMessage({ channel: 'siv-demo-2', ...message }, window.location.origin)
      if (data.type === 'ready')
        reply({ auth: active.auth, method: active.method, publicKey: active.publicKey, type: 'init' })
      if (data.type === 'resize' && typeof data.height === 'number')
        setHeight(Math.min(4000, Math.max(300, data.height + 24)))
      if (data.type === 'forgotten') {
        setReceiptDeleted(true)
        setSearch('')
      }
      if (data.type === 'submit') {
        try {
          const next = acceptSubmission(active, data.submission)
          currentElection.current = next
          setElection(next)
          setStep(3)
          reply({ type: 'accepted' })
        } catch (e) {
          reply({ message: e instanceof Error ? e.message : 'Could not accept this ballot.', type: 'rejected' })
        }
      }
    }
    window.addEventListener('message', listen)
    return () => window.removeEventListener('message', listen)
  }, [])

  function grantCode() {
    if (!name.trim() || busy) return
    setBusy(true)
    setError('')
    // Let the loading state paint before generating the example ballots.
    window.setTimeout(() => {
      try {
        const next = createElection(method)
        currentElection.current = next
        setElection(next)
      } catch {
        setError('Could not prepare the demo election. Please try again.')
      } finally {
        setBusy(false)
      }
    }, 30)
  }

  async function unlock() {
    if (!election || !submitted || busy) return
    setBusy(true)
    setError('')
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 50))
      setRows(await unlockElection(election))
      setStep(4)
    } catch {
      setError('Could not unlock the demo ballots. Your encrypted submission is still here; please try again.')
    } finally {
      setBusy(false)
    }
  }

  function restart() {
    currentElection.current = null
    setElection(null)
    setRows([])
    setStep(0)
    setName('')
    setSearch('')
    setReceiptDeleted(false)
    setShowReceipt(false)
    setError('')
    setHeight(650)
  }

  return (
    <div className={`${h26fonts} min-h-screen bg-[#f5f5ef] text-[#20392e] antialiased`}>
      <Head title="SIV Demo · An election you can verify" />
      <TailwindPreflight />
      <Nav />
      <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
        <div className="flex items-center justify-between gap-4 border-b border-[#20392e]/15 pb-5">
          <p className="text-[10px] font-medium uppercase tracking-[.2em] text-[#5d7164]">
            An election, from start to finish
          </p>
          {step > 0 && (
            <button
              className="flex items-center gap-1.5 text-xs text-[#607367] hover:text-[#20392e]"
              disabled={busy}
              onClick={restart}
              type="button"
            >
              <RotateCcw size={13} /> Start over
            </button>
          )}
        </div>
        <ol className="my-7 grid grid-cols-4 gap-2 sm:mb-12">
          {STAGES.map((label, i) => (
            <li key={label}>
              <button
                aria-current={stage === i ? 'step' : undefined}
                className={`flex items-center gap-2 text-left text-[10px] sm:gap-3 sm:text-xs ${
                  stage === i ? 'text-[#215c42]' : 'text-[#849185]'
                }`}
                disabled={busy || i > stage || (i === 2 && !election) || (i === 3 && !rows.length)}
                onClick={() => setStep(i === 3 ? 4 : i === 2 && submitted ? 3 : i)}
                type="button"
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                    stage === i ? 'border-[#215c42] bg-[#215c42] text-white' : 'border-current'
                  }`}
                >
                  {i < stage ? <Check size={12} /> : i === 0 ? <Play size={10} /> : `0${i}`}
                </span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ol>
        <header className={`mb-8 ${step === 0 ? 'max-w-3xl sm:mb-10' : 'max-w-2xl'}`}>
          <p className="mb-4 text-[10px] uppercase tracking-[.2em] text-[#64806c]">
            {step === 0
              ? 'The SIV interactive demo'
              : step === 4
              ? '03 / Verifiable results'
              : step === 1
              ? '01 / One person, one vote'
              : '02 / Private voting'}
          </p>
          <h1
            className={`font-serif26 whitespace-pre-line font-normal tracking-[-.035em] ${
              step === 0
                ? 'text-[clamp(2.6rem,6vw,4.7rem)] leading-[1.05]'
                : 'text-[clamp(2rem,4vw,3.1rem)] leading-[1.12]'
            }`}
            ref={heading}
            tabIndex={-1}
          >
            {TITLES[step]}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#617166]">{DESCRIPTIONS[step]}</p>
        </header>

        {step === 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  Icon: UserCheck,
                  label: 'One person, one vote',
                  number: '01',
                  text: 'Identify eligible voters. Give each person a unique Voter Code.',
                },
                {
                  Icon: LockKeyhole,
                  label: 'Private voting',
                  number: '02',
                  text: 'Choose on your own device. Submit an encrypted ballot.',
                },
                {
                  Icon: ShieldCheck,
                  label: 'Verifiable results',
                  number: '03',
                  text: 'Find your vote in the published results. Check that it was counted correctly.',
                },
              ].map(({ Icon, label, number, text }) => (
                <div className="rounded-xl border border-[#20392e]/10 bg-white p-6" key={label}>
                  <div className="mb-7 flex items-center justify-between">
                    <Icon className="text-[#357553]" size={23} strokeWidth={1.5} />
                    <span className="font-mono text-xs text-[#98a095]">{number}</span>
                  </div>
                  <h2 className="font-serif26 text-xl">{label}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#69776b]">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <p className="max-w-lg text-xs leading-relaxed text-[#6e7d70]">
                A guided voter experience with optional security explorations. No account needed. This example election
                runs in your browser; no real ballot is cast.
              </p>
              <button className="primary" onClick={() => setStep(1)} type="button">
                Start as a voter <ArrowRight size={16} />
              </button>
            </div>
            <details className="mt-10 border-t border-[#20392e]/10 pt-5">
              <summary className="text-sm">How does this fit a real election?</summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#617166]">
                SIV can be offered alongside paper voting. Administrators establish eligibility and coordinate
                participation across channels; voters receive a simple digital voting experience. This walkthrough
                focuses on what the voter sees. Operational benefits and voter satisfaction should be evaluated using
                documented election outcomes.
              </p>
            </details>
          </>
        )}

        {step === 1 && (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-xl border border-[#20392e]/10 bg-white p-6 sm:p-8">
              <Mail className="mb-5 text-[#357553]" size={25} strokeWidth={1.5} />
              <h2 className="font-serif26 text-2xl">One Voter Code per eligible voter.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#617166]">
                For a US government election, a familiar option is to include a one-time Voter Code in the voter’s
                postal mailing. The code opens the ballot; it can be accepted once.
              </p>
              <details className="mt-6">
                <summary>Other ways to identify voters</summary>
                <div className="mt-4 space-y-4">
                  {[
                    ['Postal mail', 'Send a code to the address on the voter’s registration record.'],
                    ['Email invitation', 'Send a unique link to a preapproved voter.'],
                    ['In-person QR code', 'Check eligibility in person and hand the voter their code.'],
                    [
                      'Digital credentials',
                      'Use an organization’s identity system or military CAC credentials where supported.',
                    ],
                    ['Custom authentication', 'Combine identity checks and delivery methods to suit the election.'],
                  ].map(([label, text]) => (
                    <div key={label}>
                      <h3 className="text-sm font-medium">{label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#617166]">{text}</p>
                    </div>
                  ))}
                </div>
              </details>
              <p className="mt-6 border-t border-[#20392e]/10 pt-4 text-xs leading-relaxed text-[#7a8579]">
                A code controls access; accurate voter rolls and participation audits establish who should receive one.
              </p>
            </div>
            <div className="rounded-xl bg-[#e7eddf] p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[.18em] text-[#5f785e]">A shortcut for this demo</p>
              <h2 className="font-serif26 mt-3 text-2xl">We don’t have a voter roll for you.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#617166]">
                You arrived at a public link. Enter any name to receive a demo code. This illustrates admission to a
                ballot; it does not verify your identity.
              </p>
              {!election ? (
                <form
                  className="mt-6"
                  onSubmit={(e) => {
                    e.preventDefault()
                    grantCode()
                  }}
                >
                  <label className="block text-xs font-medium" htmlFor="demo-name">
                    Name for your invitation
                  </label>
                  <input
                    autoComplete="off"
                    className="mt-2 w-full rounded-lg border border-[#20392e]/20 bg-white p-3 text-sm"
                    disabled={busy}
                    id="demo-name"
                    maxLength={60}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or a nickname"
                    required
                    value={name}
                  />
                  <fieldset className="mt-5">
                    <legend className="text-xs font-medium">Try a ballot style</legend>
                    <div className="mt-2 flex gap-2">
                      {(['plurality', 'approval'] as const).map((m) => (
                        <label
                          className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${
                            method === m ? 'border-[#48784d] bg-white' : 'border-[#20392e]/15'
                          }`}
                          key={m}
                        >
                          <input
                            checked={method === m}
                            disabled={busy}
                            name="method"
                            onChange={() => setMethod(m)}
                            type="radio"
                            value={m}
                          />
                          {m === 'plurality' ? 'Choose one' : 'Approval'}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <button className="primary mt-6 w-full" disabled={busy || !name.trim()} type="submit">
                    {busy ? 'Preparing your election…' : 'Get my demo Voter Code'} {!busy && <ArrowRight size={15} />}
                  </button>
                  <p className="mt-3 text-xs text-[#71816b]">
                    Your name stays on this page. Nothing is emailed or mailed.
                  </p>
                </form>
              ) : (
                <div className="mt-6">
                  <p className="text-sm">Your invitation, {name.trim()}.</p>
                  <p className="mt-5 text-[10px] uppercase tracking-widest text-[#617166]">Your one-time Voter Code</p>
                  <p className="mt-2 font-mono text-3xl tracking-wider">{election.auth}</p>
                  <p className="mt-3 text-xs leading-relaxed text-[#617166]">
                    In a real election, you would get this through the election’s chosen delivery and authentication
                    process.
                  </p>
                  <button className="primary mt-6 w-full" onClick={() => setStep(submitted ? 3 : 2)} type="button">
                    {submitted ? 'Return to your submitted vote' : 'Open my ballot'} <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {election && (
          <div className={step === 2 || step === 3 || (step === 4 && showReceipt) ? 'block' : 'hidden'}>
            <div className="overflow-hidden rounded-xl border border-[#20392e]/15 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#20392e]/10 bg-[#fafbf8] px-5 py-3">
                <span className="flex items-center gap-2 text-xs font-medium">
                  <span className="size-1.5 rounded-full bg-[#45845e]" />
                  SIV voter interface
                </span>
                <span className="text-[10px] text-[#7c887c]">Example election</span>
              </div>
              <iframe
                className="block w-full border-0"
                key={election.auth}
                ref={iframe}
                src="/demo-2/voter"
                style={{ height }}
                title="SIV ballot and private voter receipt"
              />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#81907e]">
              Uses SIV’s production ballot and receipt components and real encryption. Submission is accepted by this
              browser-only demo election.
            </p>
          </div>
        )}

        {step === 3 && election && (
          <>
            <section className="mt-7 rounded-xl border border-[#20392e]/10 bg-white p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#357553]" size={19} />
                <h2 className="text-sm font-medium">Your encrypted ballot is on the board</h2>
              </div>
              <p className="mt-2 text-sm text-[#617166]">
                {election.submissions.length} submitted ballots. Your submission is highlighted; selections remain
                encrypted.
              </p>
              <Board election={election} />
            </section>
            <section className="mt-7 rounded-xl bg-[#e7eddf] p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[.18em] text-[#5f785e]">The second demo shortcut</p>
              <div className="mt-3 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <h2 className="font-serif26 text-2xl">Skip the wait. Open the results.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#617166]">
                    A real election waits until voting closes. Independent Privacy Protectors shuffle and jointly unlock
                    ballots. Here, one local demo key lets us re-encrypt, shuffle, and decrypt immediately.
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-[#7b8874]">
                    This demonstrates the cryptographic operations, without independent trustees, threshold unlocking,
                    or published shuffle proofs.
                  </p>
                </div>
                <button className="primary" disabled={busy} onClick={unlock} type="button">
                  {busy ? 'Shuffling & unlocking…' : 'Unlock demo results'} {!busy && <ArrowRight size={16} />}
                </button>
              </div>
            </section>
          </>
        )}

        {step === 4 && election && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 text-[11px] text-[#617166]">
              {['Voter Codes separated', 'Ballots re-encrypted & shuffled', 'Contents unlocked'].map((label) => (
                <span
                  className="flex items-center gap-1.5 rounded-full border border-[#20392e]/10 px-3 py-2"
                  key={label}
                >
                  <Check size={12} />
                  {label}
                </span>
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <section className="panel">
                <p className="eyebrow">Election results</p>
                <h2 className="font-serif26 mt-3 text-2xl">City Mayoral Election</h2>
                <p className="mt-2 text-xs text-[#7b8874]">
                  {rows.length} ballots · {election.method === 'plurality' ? 'Choose one' : 'Approval voting'}
                </p>
                <div className="mt-6 space-y-4">
                  {ranking
                    .filter((candidate) => candidate !== 'BLANK')
                    .map((candidate) => (
                      <div key={candidate}>
                        <div className="mb-2 flex justify-between gap-2 text-sm">
                          <span>{candidate}</span>
                          <span className="font-mono text-[#617166]">{tallies.vote[candidate]}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#edf0e8]">
                          <div
                            className="h-full rounded-full bg-[#427656]"
                            style={{ width: `${(100 * tallies.vote[candidate]) / rows.length}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
                <details className="mt-6 text-xs">
                  <summary>Inspect the production tally</summary>
                  <RoundResults
                    ballot_design={[design]}
                    id="vote"
                    ordered={ranking}
                    tallies={tallies.vote}
                    totalVotes={rows.length}
                  />
                </details>
              </section>
              <Participation election={election} />
            </div>
            <section className="panel">
              <p className="eyebrow">Your vote, in the public record</p>
              <h2 className="font-serif26 mt-3 text-2xl">Find your Verification #.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#617166]">
                Use the number from your private receipt. The row beside it should show exactly what you chose. The
                published table contains no names or Voter Codes.
              </p>
              <label className="mt-5 block text-xs font-medium" htmlFor="verification-search">
                Your secret Verification #
              </label>
              <input
                autoComplete="off"
                className="mt-2 w-full max-w-sm rounded-lg border border-[#20392e]/20 bg-[#fafbf8] p-3 font-mono text-sm"
                id="verification-search"
                inputMode="numeric"
                onChange={(e) => setSearch(e.target.value.replace(/\D/g, '').slice(0, 14))}
                placeholder="Enter the number from your receipt"
                value={search}
              />
              {search && (
                <p className={`mt-3 text-sm ${found ? 'text-[#287148]' : 'text-[#886132]'}`} role="status">
                  {found
                    ? 'Found. Compare the highlighted selections with your intended vote.'
                    : 'No exact match yet. Check all digits against your receipt.'}
                </p>
              )}
              <div className="mt-5 max-h-80 overflow-auto rounded-lg border border-[#20392e]/10">
                <table className="w-full whitespace-nowrap text-left text-xs">
                  <thead className="sticky top-0 bg-[#f0f3eb]">
                    <tr>
                      <th className="p-3 font-medium">Verification #</th>
                      {columns.map((c) => (
                        <th className="p-3 font-medium" key={c}>
                          {election.method === 'plurality' ? 'Mayor' : `Choice ${c.split('_').pop()}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        className={found === row ? 'bg-[#dcebd5]' : 'border-t border-[#20392e]/[.06]'}
                        key={row.tracking}
                      >
                        <td className="p-3 font-mono">{row.tracking}</td>
                        {columns.map((c) => (
                          <td className="p-3" key={c}>
                            {row[c] === 'BLANK' ? '—' : row[c]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                className="mt-5 flex items-center gap-1 text-sm text-[#357553] underline-offset-4 hover:underline"
                onClick={() => {
                  setShowReceipt(!showReceipt)
                  if (!showReceipt)
                    window.setTimeout(() => iframe.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                }}
                type="button"
              >
                {showReceipt ? 'Hide' : 'Open'} my receipt & protection tools <ChevronRight size={14} />
              </button>
              {receiptDeleted && (
                <p className="mt-2 text-xs text-[#7b8874]">
                  You deleted your private receipt. Use a copy you saved, if you have one.
                </p>
              )}
            </section>
            <section className="panel">
              <p className="eyebrow">Beyond checking your own ballot</p>
              <h2 className="font-serif26 mt-3 text-2xl">How much would an audit need to check?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#617166]">
                Anyone can add up the published votes. An audit must also check eligibility, participation, and whether
                the recorded choices reflect voters’ intentions. A narrow outcome generally needs more checking.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-[#f2f4ed] p-4">
                  <p className="text-xs text-[#71816b]">Top-two margin / ballots</p>
                  <p className="font-serif26 mt-2 text-3xl">{(100 * margin).toFixed(1)}%</p>
                </div>
                <div className="rounded-lg bg-[#f2f4ed] p-4">
                  <label className="text-xs text-[#71816b]" htmlFor="audit-risk">
                    Illustrative detection probability
                  </label>
                  <select
                    className="mt-3 block w-full bg-transparent text-lg"
                    id="audit-risk"
                    onChange={(e) => setRisk(Number(e.target.value))}
                    value={risk}
                  >
                    <option value={0.1}>90%</option>
                    <option value={0.05}>95%</option>
                    <option value={0.01}>99%</option>
                  </select>
                </div>
                <div className="rounded-lg bg-[#e7eddf] p-4">
                  <p className="text-xs text-[#71816b]">
                    {sample && sample < rows.length ? 'Illustrative random draws' : 'Full review suggested'}
                  </p>
                  <p className="font-serif26 mt-2 text-3xl">
                    {sample && sample < rows.length ? sample : rows.length}
                    <span className="ml-2 text-sm text-[#71816b]">
                      {sample && sample < rows.length ? 'draws' : 'ballots'}
                    </span>
                  </p>
                </div>
              </div>
              <details className="mt-5">
                <summary className="text-sm">What this calculation does and doesn’t establish</summary>
                <p className="mt-3 text-xs leading-relaxed text-[#71816b]">
                  This is a detection illustration, not a certified risk-limiting audit or a confidence claim about this
                  result. If at least half the normalized margin were incorrect ballots, independent uniform draws with
                  replacement would detect at least one with probability 1 − (1 − margin/2)^n. We solve for n at your
                  chosen probability. When that exceeds this small election’s size, we suggest full review. An actual
                  audit needs a trustworthy sampling frame, independent evidence, a defined error model, and escalation
                  rules; inspecting the same software’s output is insufficient. A tie also calls for full review.
                </p>
              </details>
              <p className="mt-5 text-sm text-[#617166]">
                Next steps: reconcile the voter roll and accepted Voter Codes, independently sample participation, and
                invite voters to verify their published selections.
              </p>
            </section>
            <details className="panel">
              <summary className="text-sm">Inspect the original encrypted submissions</summary>
              <p className="mt-3 text-xs leading-relaxed text-[#71816b]">
                These are the same ciphertexts accepted before unlocking. Shuffling uses fresh encryption randomness
                before contents are decrypted.
              </p>
              <Board election={election} />
            </details>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#203e30] p-7 text-white">
              <div>
                <h2 className="font-serif26 text-2xl">You’ve followed a complete election.</h2>
                <p className="mt-2 text-sm text-white/65">An invitation. A private ballot. A result you can check.</p>
              </div>
              <button
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#203e30]"
                onClick={restart}
                type="button"
              >
                Try another ballot style →
              </button>
            </div>
          </div>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <p className="mt-10 max-w-3xl text-[11px] leading-relaxed text-[#81907e]">
          About this demo: 24 fictional ballots are generated as examples; yours makes 25. Keys, the voter interface,
          and the demo bulletin board all run in this browser session. Reloading resets the election. This illustrates
          SIV’s voter journey and uses its cryptographic code; a production election adds independent infrastructure,
          trustees, and audit procedures.
        </p>
      </main>
      <Footer />
      <style jsx>{`
        .primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-shrink: 0;
          border-radius: 8px;
          padding: 14px 20px;
          background: #215c42;
          color: white;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.15s;
        }
        .primary:hover {
          background: #163e2d;
        }
        .primary:disabled {
          opacity: 0.5;
          cursor: default;
        }
        .panel {
          border: 1px solid rgba(32, 57, 46, 0.1);
          border-radius: 12px;
          background: white;
          padding: 24px;
          min-width: 0;
        }
        .eyebrow {
          color: #64806c;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        summary {
          cursor: pointer;
          color: #357553;
        }
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        summary:focus-visible {
          outline: 2px solid #357553;
          outline-offset: 4px;
        }
      `}</style>
    </div>
  )
}

function Board({ election }: { election: Election }) {
  return (
    <div className="mt-4 max-h-64 overflow-auto">
      <table className="w-full text-left text-[11px]">
        <thead className="sticky top-0 bg-[#f0f3eb]">
          <tr>
            <th className="p-3">Voter Code</th>
            <th className="p-3">Encrypted ballot</th>
          </tr>
        </thead>
        <tbody>
          {election.submissions.map((vote) => (
            <tr
              className={secretsMatch(vote.auth, election.auth) ? 'bg-[#dcebd5]' : 'border-t border-[#20392e]/[.06]'}
              key={vote.auth}
            >
              <td className="p-3 align-top font-mono">
                {vote.auth}
                {secretsMatch(vote.auth, election.auth) && (
                  <span className="mt-1 block text-[10px]">Your submission</span>
                )}
              </td>
              <td className="p-3">
                <details>
                  <summary className="cursor-pointer font-mono text-[#617166]">
                    {Object.values(vote.encrypted)[0]?.encrypted.slice(0, 20)}…
                  </summary>
                  <pre className="mt-2 max-w-[600px] whitespace-pre-wrap break-all text-[10px]">
                    {JSON.stringify(vote.encrypted, null, 2)}
                  </pre>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Participation({ election }: { election: Election }) {
  const start = Math.min(...election.submissions.map((v) => v.at))
  const end = Math.max(...election.submissions.map((v) => v.at))
  const buckets = Array.from(
    { length: 6 },
    (_, i) =>
      election.submissions.filter((v) => Math.min(5, Math.floor(((v.at - start) / Math.max(1, end - start)) * 6)) === i)
        .length,
  )
  const max = Math.max(...buckets, 1)
  return (
    <section className="min-w-0 rounded-xl border border-[#20392e]/10 bg-white p-6">
      <p className="text-[10px] uppercase tracking-[.15em] text-[#64806c]">Participation over time</p>
      <h2 className="font-serif26 mt-3 text-2xl">{election.submissions.length} ballots received</h2>
      <p className="mt-2 text-xs text-[#7b8874]">Fictional example voters + your submission</p>
      <svg
        aria-label={`Ballots received in six time intervals: ${buckets.join(', ')}`}
        className="mt-5 w-full"
        role="img"
        viewBox="0 0 420 170"
      >
        <line stroke="#dfe6da" x1="10" x2="410" y1="145" y2="145" />
        {buckets.map((count, i) => (
          <g key={i}>
            <rect
              fill={i === 5 ? '#215c42' : '#b8cbb1'}
              height={(count / max) * 100}
              rx="4"
              width="42"
              x={22 + i * 66}
              y={145 - (count / max) * 100}
            />
            <text fill="#617166" fontSize="11" textAnchor="middle" x={43 + i * 66} y={135 - (count / max) * 100}>
              {count}
            </text>
          </g>
        ))}
        <text fill="#81907e" fontSize="10" x="20" y="165">
          24 minutes ago
        </text>
        <text fill="#81907e" fontSize="10" textAnchor="end" x="395" y="165">
          Your vote / now
        </text>
      </svg>
      <p className="mt-4 text-xs leading-relaxed text-[#71816b]">
        Participation can be monitored while voting is open. Choices stay encrypted until the election closes.
      </p>
    </section>
  )
}
