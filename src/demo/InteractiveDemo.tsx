import { Mail } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'
import {
  default_max_score,
  default_min_score,
  default_multiple_votes_allowed,
} from 'src/admin/BallotDesign/Wizard'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { defaultRankingsAllowed } from 'src/vote/Ballot'
import { BudgetItem } from 'src/vote/BudgetItem'
import { Item } from 'src/vote/Item'
import { MultiVoteItem } from 'src/vote/MultiVoteItem'
import { RankedChoiceItem } from 'src/vote/RankedChoiceItem'
import { ScoreItem } from 'src/vote/ScoreItem'
import { Item as BallotItem } from 'src/vote/storeElectionInfo'
import { strengthenTracking } from 'src/vote/strengthen-tracking'
import { generateTrackingNum } from 'src/vote/tracking-num'
import { State as VoteState } from 'src/vote/vote-state'

import { CANDIDATES, DemoStep, POSTER_PROPERTIES, STEP_META } from './demo-data'

type BallotMethod = 'approval' | 'budget' | 'multi' | 'plurality' | 'ranked' | 'score'

type DemoState = {
  auth: string
  buyerScreenshot: null | string
  choice: null | string
  coercedChoice: null | string
  completed: Set<string>
  device1Tampered: boolean
  digits: string
  future: DemoStep[]
  history: DemoStep[]
  honestChoice: null | string
  malwareConfirmed: boolean
  overridden: boolean
  search: string
  step: DemoStep
  strengthened: null | string
  unlocked: UnlockedVote[]
  verification: null | string
}

type UnlockedVote = { choice: string; verification: string; yours?: boolean }

const BALLOT_METHODS: { id: BallotMethod; label: string }[] = [
  { id: 'plurality', label: 'Plurality' },
  { id: 'ranked', label: 'Ranked Choice' },
  { id: 'approval', label: 'Approval' },
  { id: 'multi', label: 'Choose up to X' },
  { id: 'score', label: 'Score' },
  { id: 'budget', label: 'Budget' },
]

const DEMO_BUDGET_AVAILABLE = 50

const DEMO_BALLOT_OPTIONS = CANDIDATES.map((name) => ({ name }))

const OTHER_VOTERS = [
  { auth: 'a1b2c3d4', name: 'Barton, Adam' },
  { auth: 'e5f6g7h8', name: 'Green, Elissa' },
  { auth: 'i9j0k1l2', name: 'Hauck, Erik' },
  { auth: 'm3n4o5p6', name: 'Schuster, Brad' },
]

export function InteractiveDemo() {
  const [s, setS] = useState<DemoState>(initState)

  const activeVerification = s.strengthened || s.verification
  const boardVotes = useMemo(() => {
    if (!s.verification || !s.choice) return []
    return [
      ...OTHER_VOTERS.map((v) => ({
        auth: v.auth,
        cipher: fakeCipher(v.auth + v.name),
        name: v.name,
        yours: false,
      })),
      {
        auth: s.auth || 'you····',
        cipher: fakeCipher(s.verification + s.choice),
        name: 'You',
        yours: true,
      },
    ]
  }, [s.auth, s.choice, s.verification])

  const strengthenPreview =
    s.verification && s.digits.length === 4 ? strengthenTracking(s.verification, s.digits) : null

  const searchHit =
    s.search.trim().length >= 4 &&
    s.unlocked.find((v) => v.verification.replace(/\D/g, '').includes(s.search.replace(/\D/g, '')))

  const tallies = useMemo(() => {
    const counts: Record<string, number> = {}
    CANDIDATES.forEach((c) => {
      counts[c] = 0
    })
    s.unlocked.forEach((v) => {
      splitChoices(v.choice).forEach((c) => {
        counts[c] = (counts[c] || 0) + 1
      })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [s.unlocked])

  const start = () =>
    setS(
      go(
        {
          ...initState(),
          auth: generateAuthToken().slice(0, 8),
          completed: new Set(),
        },
        'invite',
      ),
    )

  const restart = () => setS(initState())
  const goBack = () => setS((prev) => back(prev))
  const goForward = () => setS((prev) => forward(prev))

  const sealVote = (choice: string) => {
    const verification = generateTrackingNum()
    setS((prev) =>
      go(
        {
          ...prev,
          choice,
          honestChoice: prev.honestChoice || choice,
          verification,
        },
        'encrypt',
      ),
    )
  }

  const buildUnlocked = (choice: string, verification: string, overridden: boolean): UnlockedVote[] => {
    const others: UnlockedVote[] = OTHER_VOTERS.map((_, i) => ({
      choice: CANDIDATES[i % CANDIDATES.length],
      verification: generateTrackingNum(),
    }))
    // If overridden, the buyer's screenshot # is absent; honest vote is present under new #
    if (overridden) {
      return [
        ...others,
        { choice, verification, yours: true },
        // decoy that looks like a coerced cast that was cancelled
      ]
    }
    return [...others, { choice, verification, yours: true }]
  }

  const runUnlock = () => {
    setS((prev) => {
      const choice = prev.overridden ? prev.honestChoice || prev.choice : prev.choice
      const verification = prev.strengthened || prev.verification
      if (!choice || !verification) return prev
      const unlocked = buildUnlocked(choice, verification, prev.overridden)
      return go({ ...prev, search: verification, unlocked }, 'unlock')
    })
  }

  const pathSteps: [DemoStep, string][] = [
    ['intro', 'Start'],
    ['invite', 'Invite'],
    ['vote', 'Vote'],
    ['encrypt', 'Encrypt'],
    ['submit', 'Submit'],
    ['malware', 'Malware'],
    ['strengthen', 'Strengthen #'],
    ['coercion', 'Override'],
    ['unlock', 'Unlock'],
    ['verify', 'Verify'],
    ['audit', 'Audit'],
  ]

  const jumpToProperty = (id: string) => {
    const jump: Partial<Record<string, DemoStep>> = {
      coercion: 'coercion',
      'ground-truth': s.unlocked.length ? 'verify' : 'unlock',
      malware: 'malware',
      open: s.unlocked.length ? 'audit' : 'submit',
      privacy: s.verification ? 'encrypt' : 'vote',
      stuffing: s.unlocked.length ? 'audit' : 'invite',
    }
    const step = jump[id]
    if (step) setS((prev) => visit(prev, step))
  }

  return (
    <NoSsr>
      <div className="demo">
        {/* Path + restart — full width above both columns */}
        <div className="flex gap-3 items-center mb-5 sm:mb-6">
          <div className="overflow-x-auto flex-1 px-1 -mx-1 min-w-0">
            <ol className="flex w-max gap-1.5">
              {pathSteps.map(([id, label]) => (
                <li key={id}>
                  <button
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[0.72rem] transition-colors ${
                      s.step === id
                        ? 'bg-h26-green/15 font-medium text-h26-green'
                        : 'bg-black/[0.04] text-h26-textSecondary hover:bg-black/[0.07] hover:text-h26-text'
                    }`}
                    onClick={() => setS((prev) => visit(prev, id))}
                    type="button"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <button
            className="shrink-0 whitespace-nowrap text-[0.75rem] text-h26-muted underline-offset-2 hover:text-h26-text hover:underline"
            onClick={restart}
            type="button"
          >
            Restart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
          {/* Main stage first on phone */}
          <section className="order-1 min-w-0 lg:order-2">
            <header className="mb-5 sm:mb-6">
              <p className="font-mono26 mb-2 text-[10px] uppercase tracking-[0.16em] text-h26-muted">
                Interactive demo
              </p>
              <h1 className="font-serif26 text-[clamp(1.35rem,5vw,2.1rem)] font-normal tracking-tight text-h26-text">
                {STEP_META[s.step].title}
              </h1>
              <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-h26-textSecondary sm:text-[0.95rem]">
                {STEP_META[s.step].blurb}
              </p>
            </header>

            <div className="rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] sm:p-8">
              {(s.history.length > 0 || s.future.length > 0) && (
                <div className="mb-5 flex gap-1.5">
                  <button
                    aria-label="Previous step"
                    className="inline-flex size-8 items-center justify-center rounded-full border border-black/10 text-lg text-h26-textSecondary transition-colors hover:border-h26-green/40 hover:bg-h26-green/[0.06] hover:text-h26-green disabled:cursor-not-allowed disabled:opacity-25"
                    disabled={!s.history.length}
                    onClick={goBack}
                    title="Previous step"
                    type="button"
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Next step"
                    className="inline-flex size-8 items-center justify-center rounded-full border border-black/10 text-lg text-h26-textSecondary transition-colors hover:border-h26-green/40 hover:bg-h26-green/[0.06] hover:text-h26-green disabled:cursor-not-allowed disabled:opacity-25"
                    disabled={!s.future.length}
                    onClick={goForward}
                    title="Next step"
                    type="button"
                  >
                    ›
                  </button>
                </div>
              )}
              {s.step === 'intro' && <Intro onStart={start} />}
              {s.step === 'invite' && <Invite auth={s.auth} onContinue={() => setS((prev) => go(prev, 'vote'))} />}
              {s.step === 'vote' && <Vote onPick={sealVote} />}
              {s.step === 'encrypt' &&
                (s.choice && s.verification ? (
                  <Encrypt
                    choice={s.choice}
                    onContinue={() => setS((prev) => go(prev, 'submit'))}
                    verification={s.verification}
                  />
                ) : (
                  <NeedVote onStart={start} />
                ))}
              {s.step === 'submit' && (
                <Submit
                  boardVotes={boardVotes}
                  onAudit={() => setS((prev) => go(prev, 'audit'))}
                  onCoercion={() => setS((prev) => go(prev, 'coercion'))}
                  onMalware={() => setS((prev) => go(prev, 'malware'))}
                  onUnlock={runUnlock}
                />
              )}
              {s.step === 'malware' &&
                (s.choice && s.verification ? (
                  <Malware
                    choice={s.choice}
                    confirmed={s.malwareConfirmed}
                    device1Tampered={s.device1Tampered}
                    onConfirm={() => setS((prev) => markComplete({ ...prev, malwareConfirmed: true }, ['malware']))}
                    onContinue={() => setS((prev) => go(markComplete(prev, ['malware']), 'strengthen'))}
                    onSkip={() => setS((prev) => go(prev, 'coercion'))}
                    onTamper={() => setS((prev) => ({ ...prev, device1Tampered: true, malwareConfirmed: false }))}
                    verification={s.verification}
                  />
                ) : (
                  <NeedVote onStart={start} />
                ))}
              {s.step === 'strengthen' &&
                (s.verification ? (
                  <Strengthen
                    digits={s.digits}
                    onChangeDigits={(digits) =>
                      setS((prev) => ({ ...prev, digits: digits.replace(/\D/g, '').slice(0, 4) }))
                    }
                    onContinue={() => setS((prev) => go(prev, 'coercion'))}
                    onSkip={() => setS((prev) => go(prev, 'coercion'))}
                    onStrengthen={() => {
                      if (!strengthenPreview) return
                      setS((prev) => markComplete({ ...prev, strengthened: strengthenPreview }, ['malware']))
                    }}
                    original={s.verification}
                    preview={strengthenPreview}
                    strengthened={s.strengthened}
                  />
                ) : (
                  <NeedVote onStart={start} />
                ))}
              {s.step === 'coercion' &&
                (s.choice && s.verification ? (
                  <Coercion
                    activeVerification={activeVerification}
                    buyerScreenshot={s.buyerScreenshot}
                    choice={s.choice}
                    honestChoice={s.honestChoice}
                    onCastForBuyer={(coercedChoice) => {
                      const verification = s.verification || generateTrackingNum()
                      setS((prev) => ({
                        ...prev,
                        buyerScreenshot: verification,
                        choice: coercedChoice,
                        coercedChoice,
                        verification,
                      }))
                    }}
                    onOverride={(honest) => {
                      const newVerification = generateTrackingNum()
                      setS((prev) =>
                        markComplete(
                          {
                            ...prev,
                            choice: honest,
                            honestChoice: honest,
                            overridden: true,
                            strengthened: null,
                            verification: newVerification,
                          },
                          ['coercion'],
                        ),
                      )
                    }}
                    onSkip={() => runUnlock()}
                    onUnlock={runUnlock}
                    overridden={s.overridden}
                  />
                ) : (
                  <NeedVote onStart={start} />
                ))}
              {s.step === 'unlock' &&
                (s.unlocked.length ? (
                  <Unlock onContinue={() => setS((prev) => go(prev, 'verify'))} unlocked={s.unlocked} />
                ) : s.choice && s.verification ? (
                  <div>
                    <p className="text-[0.85rem] text-h26-textSecondary">Ready when you are.</p>
                    <PrimaryButton className="mt-4" onClick={runUnlock}>
                      Fast-forward shuffle & unlock
                    </PrimaryButton>
                  </div>
                ) : (
                  <NeedVote onStart={start} />
                ))}
              {s.step === 'verify' &&
                (s.unlocked.length && activeVerification ? (
                  <Verify
                    activeVerification={activeVerification}
                    buyerScreenshot={s.buyerScreenshot}
                    onAudit={() => setS((prev) => go(prev, 'audit'))}
                    onDone={() => setS((prev) => go(prev, 'done'))}
                    overridden={s.overridden}
                    search={s.search}
                    searchHit={searchHit}
                    setSearch={(search) => setS((prev) => ({ ...prev, search }))}
                    tallies={tallies}
                    unlocked={s.unlocked}
                  />
                ) : (
                  <NeedVote label="Vote and unlock first to verify." onStart={start} />
                ))}
              {s.step === 'audit' && (
                <Audit
                  boardVotes={boardVotes}
                  onDone={() => setS((prev) => go(prev, s.unlocked.length ? 'done' : 'submit'))}
                  tallies={tallies}
                  unlocked={s.unlocked}
                />
              )}
              {s.step === 'done' && <Done completed={s.completed} onRestart={restart} />}
            </div>
          </section>

          {/* Poster legend — below on phone, sidebar on desktop */}
          <aside className="order-2 lg:order-1 lg:sticky lg:top-6 lg:self-start">
            <p className="font-mono26 mb-3 text-[10px] uppercase tracking-[0.16em] text-h26-muted">
              Advanced properties
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {POSTER_PROPERTIES.map((p) => {
                const done = s.completed.has(p.id)
                return (
                  <li key={p.id}>
                    <button
                      className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                        done
                          ? 'bg-h26-green/[0.1] text-h26-text'
                          : 'bg-black/[0.03] text-h26-textSecondary hover:bg-black/[0.05] hover:text-h26-text'
                      }`}
                      onClick={() => jumpToProperty(p.id)}
                      type="button"
                    >
                      <div className="flex gap-2 items-start">
                        <span
                          className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                            done ? 'border-h26-green bg-h26-green text-white' : 'border-black/15 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <div>
                          <div className="text-[0.8rem] font-medium leading-snug">{p.label}</div>
                          <div className="mt-0.5 text-[0.7rem] leading-snug opacity-70">{p.short}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      </div>
    </NoSsr>
  )
}

function Audit({
  boardVotes,
  onDone,
  tallies,
  unlocked,
}: {
  boardVotes: { auth: string; cipher: string; name: string; yours: boolean }[]
  onDone: () => void
  tallies: [string, number][]
  unlocked: UnlockedVote[]
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.85rem] font-medium">1. Voter roll ↔ accepted ciphertexts</p>
        <p className="mt-1 text-[0.8rem] text-h26-textSecondary">
          {boardVotes.length} encrypted submissions, each tied to a registered auth token. No anonymous stuffing.
        </p>
      </div>
      <div>
        <p className="text-[0.85rem] font-medium">2. Independent tally</p>
        {unlocked.length ? (
          <ul className="mt-2 space-y-1 text-[0.85rem]">
            {tallies.map(([name, n]) => (
              <li key={name}>
                {name}: <b>{n}</b>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[0.8rem] text-h26-textSecondary">
            Unlock first to re-tally plaintext. Encrypted board is already public.
          </p>
        )}
      </div>
      <div>
        <p className="text-[0.85rem] font-medium">3. Risk-limiting style spot check</p>
        <p className="mt-1 text-[0.8rem] text-h26-textSecondary">
          Sampled 2 of {OTHER_VOTERS.length + 1} voters from the roll — both confirmed they cast (scripted for demo).
          Paper + digital can sit on the same status page in production.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onDone}>Continue</PrimaryButton>
      </div>
    </div>
  )
}

function back(prev: DemoState): DemoState {
  if (!prev.history.length) return prev
  return {
    ...prev,
    future: [prev.step, ...prev.future],
    history: prev.history.slice(0, -1),
    step: prev.history[prev.history.length - 1],
  }
}

function ballotDesignFor(method: BallotMethod): BallotItem {
  const base = {
    id: 'vote',
    options: DEMO_BALLOT_OPTIONS,
    title: 'Who should be the next Mayor?',
    write_in_allowed: false,
  }
  if (method === 'approval') return { ...base, type: 'approval' }
  if (method === 'multi')
    return { ...base, multiple_votes_allowed: default_multiple_votes_allowed, type: 'multiple-votes-allowed' }
  if (method === 'ranked')
    return { ...base, multiple_votes_allowed: defaultRankingsAllowed, type: 'ranked-choice-irv' }
  if (method === 'score')
    return { ...base, max_score: default_max_score, min_score: default_min_score, type: 'score' }
  if (method === 'budget') return { ...base, budget_available: DEMO_BUDGET_AVAILABLE, type: 'budget' }
  return { ...base, type: 'choose-only-one' }
}

function choiceFromPlaintext(method: BallotMethod, plaintext: Record<string, string>) {
  const filled = Object.entries(plaintext).filter(([, v]) => v && v !== 'BLANK')
  if (!filled.length) return null
  if (method === 'plurality') return plaintext.vote || null
  if (method === 'approval' || method === 'multi') return joinChoices(filled.map(([, v]) => v).sort())
  if (method === 'ranked')
    return filled
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([, v], i) => `${i + 1}. ${v}`)
      .join(', ')
  return filled.map(([k, v]) => `${k.replace(/^vote_/, '')}: ${v}`).join(', ')
}

function Coercion({
  activeVerification,
  buyerScreenshot,
  choice,
  honestChoice,
  onCastForBuyer,
  onOverride,
  onSkip,
  onUnlock,
  overridden,
}: {
  activeVerification: null | string
  buyerScreenshot: null | string
  choice: null | string
  honestChoice: null | string
  onCastForBuyer: (c: string) => void
  onOverride: (honest: string) => void
  onSkip: () => void
  onUnlock: () => void
  overridden: boolean
}) {
  const approved = new Set(splitChoices(honestChoice || choice || ''))
  const demanded = CANDIDATES.find((c) => !approved.has(c)) || CANDIDATES[0]
  const [honest, setHonest] = useState(() => new Set(splitChoices(honestChoice || choice || CANDIDATES[1])))

  return (
    <div>
      <p className="mb-4 text-[0.85rem] text-h26-textSecondary">
        Based on{' '}
        <a
          className="font-medium text-h26-green underline-offset-2 hover:underline"
          href="https://blog.siv.org/2025/08/overrides"
          rel="noreferrer"
          target="_blank"
        >
          Verifiable Private Overrides
        </a>
        . Appear to comply, then cancel privately.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="px-4 py-4 bg-red-50 rounded-xl">
          <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-red-800/70">The buyer</p>
          <p className="mt-2 text-[0.9rem]">
            “Vote for <b>{demanded}</b> and send me your Verification #.”
          </p>
          {buyerScreenshot && (
            <div className="mt-3 rounded-lg bg-white/80 px-3 py-2 font-mono26 text-[0.75rem]">
              Screenshot: {buyerScreenshot}
              <div className="mt-1 text-[0.7rem] text-red-800/70">Buyer thinks this proves the cast.</div>
            </div>
          )}
        </div>

        <div className="px-4 py-4 rounded-xl bg-h26-bg">
          <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">You</p>
          {!buyerScreenshot && (
            <>
              <p className="mt-2 text-[0.85rem] text-h26-textSecondary">
                Cast their demanded vote so they get “proof.”
              </p>
              <PrimaryButton className="mt-4" onClick={() => onCastForBuyer(demanded)}>
                Cast for {demanded}
              </PrimaryButton>
            </>
          )}
          {buyerScreenshot && !overridden && (
            <>
              <p className="mt-2 text-[0.85rem] text-h26-textSecondary">
                At a polling station (separate channel), privately override with your honest approvals:
              </p>
              <ul className="mt-2 space-y-1">
                {CANDIDATES.map((c) => (
                  <li key={c}>
                    <label className="flex cursor-pointer items-center gap-2 text-[0.85rem]">
                      <input
                        checked={honest.has(c)}
                        className="accent-h26-green"
                        onChange={() =>
                          setHonest((prev) => {
                            const next = new Set(prev)
                            if (next.has(c)) next.delete(c)
                            else next.add(c)
                            return next
                          })
                        }
                        type="checkbox"
                      />
                      {c}
                    </label>
                  </li>
                ))}
              </ul>
              <PrimaryButton
                className="mt-4"
                disabled={!honest.size}
                onClick={() => onOverride(joinChoices([...honest]))}
              >
                Privately override + paper ballot
              </PrimaryButton>
            </>
          )}
          {overridden && (
            <>
              <p className="mt-2 text-[0.9rem] font-medium text-h26-green">Override recorded</p>
              <p className="mt-1 text-[0.8rem] text-h26-textSecondary">
                Honest vote: <b>{choice}</b>
              </p>
              <p className="mt-1 font-mono26 text-[0.75rem]">New #: {activeVerification}</p>
              <p className="mt-2 text-[0.75rem] text-h26-textSecondary">
                Buyer still holds {buyerScreenshot} — which won’t appear in the unlocked tally.
              </p>
            </>
          )}
        </div>
      </div>

      <ul className="mt-5 space-y-1.5 text-[0.8rem] text-h26-textSecondary">
        <li>1. Buyer can’t tell whether their demanded vote was ultimately counted.</li>
        <li>2. Admins can’t silently suppress via this power.</li>
        <li>3. On-device malware can’t self-override (separate channel required).</li>
      </ul>

      <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
        {(overridden || buyerScreenshot) && <PrimaryButton onClick={onUnlock}>Close election & unlock</PrimaryButton>}
        <SecondaryButton onClick={onSkip}>Skip override — just unlock</SecondaryButton>
      </div>
    </div>
  )
}

function DemoInviteQRCode({ auth }: { auth: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return
      const qrCode = new QRCodeStyling({
        cornersSquareOptions: { color: '#000000', type: 'square' },
        data: `https://www.local.gov/vote?auth=${auth}`,
        dotsOptions: { type: 'classy-rounded' },
        height: 128,
        qrOptions: { errorCorrectionLevel: 'M' },
        width: 128,
      })
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [auth])

  return (
    <div className="flex max-w-[11rem] flex-col items-center gap-2">
      <div aria-label="QR code containing your voting link" className="size-32 shrink-0" ref={ref} />
      <p className="break-all text-center font-mono26 text-[0.62rem] leading-snug text-h26-muted">
        local.gov/vote?auth=
        <span className="rounded border border-[#e67e37] bg-[#e67e3744] px-0.5 text-h26-text">{auth}</span>
      </p>
    </div>
  )
}

function DeviceFrame({
  children,
  label,
  ok,
  warn,
}: {
  children: React.ReactNode
  label: string
  ok?: boolean
  warn?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-4 ${
        warn ? 'border-red-300 bg-red-50/50' : ok ? 'border-h26-green/40 bg-h26-green/[0.04]' : 'border-black/10'
      }`}
    >
      <p className="font-mono26 mb-3 text-[10px] uppercase tracking-[0.14em] text-h26-muted">{label}</p>
      {children}
    </div>
  )
}

function Done({ completed, onRestart }: { completed: Set<string>; onRestart: () => void }) {
  return (
    <div>
      <p className="text-[0.95rem] text-h26-textSecondary">
        Poster properties you hit this run: <b>{completed.size}</b> / {POSTER_PROPERTIES.length}
      </p>
      <ul className="mt-4 space-y-2">
        {POSTER_PROPERTIES.map((p) => (
          <li className="flex items-center gap-2 text-[0.85rem]" key={p.id}>
            <span className={completed.has(p.id) ? 'text-h26-green' : 'text-h26-muted'}>
              {completed.has(p.id) ? '✓' : '○'}
            </span>
            {p.label}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.85rem] text-h26-textSecondary">
        Next builds could wrap the real vote UI + a live sandbox election. This prototype is for testing the story &
        room structure.
      </p>
      <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onRestart}>Run again</PrimaryButton>
        <SecondaryButton onClick={() => (window.location.href = '/protocol')}>Illustrated protocol</SecondaryButton>
        <SecondaryButton onClick={() => (window.location.href = '/resources')}>Resources</SecondaryButton>
      </div>
    </div>
  )
}

function Encrypt({
  choice,
  onContinue,
  verification,
}: {
  choice: string
  onContinue: () => void
  verification: string
}) {
  return (
    <div className="space-y-4">
      <Row
        label="Plaintext (on your device only)"
        value={`{ mayor: ${formatMayor(choice)}, verification: '${verification}' }`}
      />
      <Row emphasize label="Verification #" mono value={verification} />
      <Row label="Ciphertext leaving the device" mono value={fakeCipher(verification + choice)} />
      <p className="text-[0.8rem] text-h26-textSecondary">
        Encryption acts like sealing a locked safe. The election admin can accept it without learning how you voted.
      </p>
      <PrimaryButton className="mt-2" onClick={onContinue}>
        Submit encrypted vote
      </PrimaryButton>
    </div>
  )
}

function fakeCipher(seed: string) {
  // ponytail: decorative ciphertext for the public board; real encrypt lives in /protocol + vote UI
  const hex = seed
    .split('')
    .map((c) => (c.charCodeAt(0) * 17).toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24)
  return `{ encrypted: ${hex}…, lock: ${(hex.length * 7919).toString(16)}… }`
}

function formatMayor(choice: string) {
  return `[${splitChoices(choice)
    .map((c) => `'${c}'`)
    .join(', ')}]`
}

function forward(prev: DemoState): DemoState {
  if (!prev.future.length) return prev
  const [step, ...future] = prev.future
  return { ...prev, future, history: [...prev.history, prev.step], step }
}

function go(prev: DemoState, step: DemoStep): DemoState {
  return markComplete(visit(prev, step), STEP_META[step].unlocks)
}

function initState(): DemoState {
  return {
    auth: '',
    buyerScreenshot: null,
    choice: null,
    coercedChoice: null,
    completed: new Set(),
    device1Tampered: false,
    digits: '',
    future: [],
    history: [],
    honestChoice: null,
    malwareConfirmed: false,
    overridden: false,
    search: '',
    step: 'intro',
    strengthened: null,
    unlocked: [],
    verification: null,
  }
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <p className="text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Most voters only ever see the happy path: get an invite → vote → submit → check results and find your own vote
        in the list.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        But SIV also has defenses for when things go wrong: malware changing your vote, someone pressuring or buying
        your vote, or a result that needs end-to-end auditing.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        We design for the worst case: nation-states willing to spend military-sized budgets to sway high-stakes
        elections. And we neither ask for nor assume trust in anyone: party insiders, election officials, software and
        hardware vendors, voters, AI agents, or the SIV team itself.
      </p>
      {/* <ul className="mt-5 space-y-2 text-[0.9rem] text-h26-textSecondary">
        <li>· This is a simulated sandbox — no real election / no login</li>

        <li>· Click items on the left to jump to a defense</li>
      </ul> */}
      <PrimaryButton className="mt-8" onClick={onStart}>
        Start as a voter
      </PrimaryButton>
    </div>
  )
}

function Invite({ auth, onContinue }: { auth: string; onContinue: () => void }) {
  const [attack, setAttack] = useState<'lost' | 'used' | null>(null)
  const [layers, setLayers] = useState(() => new Set<string>())
  const [remediated, setRemediated] = useState(false)
  const [replacementAuth] = useState(() => generateAuthToken().slice(0, 8))
  const [stuffing, setStuffing] = useState<'guess' | 'reuse' | 'roll' | null>(null)
  const [topic, setTopic] = useState<'attack' | 'delivery' | 'layers' | 'stuffing' | 'token' | null>(null)
  const authLayers = [
    ['Drawn signature', 'Compare with the voter’s registration record'],
    ['ID + selfie', 'Higher-assurance identity check'],
    ['IP geolocation', 'Flag or limit unexpected locations'],
    ['Time-based code', 'Require a second possession factor'],
  ]
  const authTokenProperties = [
    'required to vote',
    'unique per voter',
    'generated by election admin',
    'infeasible to guess',
    'can only be used once',
    'if necessary, election admin can invalidate individual Auth Tokens & generate new ones',
    'used Auth Tokens can be audited after the election',
  ]

  return (
    <div>
      <div className="px-4 py-5 rounded-xl bg-h26-bg sm:px-6">
        <p className="flex items-center gap-2 text-[10px] text-h26-muted">
          <Mail aria-hidden className="size-5 shrink-0" strokeWidth={2.25} />
          <span className="font-mono26 uppercase tracking-[0.14em]">
            Vote Invitation: voter receives via postal mail
          </span>
        </p>
        <p className="mt-3 text-[1rem] text-h26-text">
          You’re invited to vote in <b>City Mayoral Election</b>.
        </p>
        <p className="mt-3 text-[0.85rem] text-h26-textSecondary">This invitation is unique to you.</p>

        <div className="mt-5 flex flex-col items-center gap-4 rounded-xl border border-black/[0.07] bg-white p-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <DemoInviteQRCode auth={auth} />
          <div className="text-center sm:text-left">
            <p className="text-[0.8rem] text-h26-textSecondary">Scan the QR code, or visit</p>
            <button
              className="mt-1 font-medium underline text-h26-green underline-offset-2"
              onClick={onContinue}
              type="button"
            >
              local.gov/election
            </button>
            <p className="mt-4 text-[0.75rem] text-h26-textSecondary">and enter your Auth Token:</p>
            <p className="mt-1 font-mono26 text-[1rem] font-medium tracking-[0.12em] text-h26-text">{auth}</p>
          </div>
        </div>
      </div>

      <PrimaryButton className="mt-5" onClick={onContinue}>
        Open ballot
      </PrimaryButton>

      <div className="mt-6 border-t border-black/[0.07] pt-5">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
          Explore this step · optional
        </p>
        <div className="grid gap-2 mt-3 sm:grid-cols-2">
          <button
            aria-expanded={topic === 'token'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              topic === 'token'
                ? 'border-h26-green/40 bg-h26-green/[0.06]'
                : 'border-black/10 hover:border-h26-green/30 hover:bg-h26-green/[0.03]'
            }`}
            onClick={() => setTopic(topic === 'token' ? null : 'token')}
            type="button"
          >
            <span className="block text-[0.82rem] font-medium text-h26-text">What is the Auth Token?</span>
            <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">Key properties</span>
          </button>
          <button
            aria-expanded={topic === 'delivery'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              topic === 'delivery'
                ? 'border-h26-green/40 bg-h26-green/[0.06]'
                : 'border-black/10 hover:border-h26-green/30 hover:bg-h26-green/[0.03]'
            }`}
            onClick={() => setTopic(topic === 'delivery' ? null : 'delivery')}
            type="button"
          >
            <span className="block text-[0.82rem] font-medium text-h26-text">Why mail? Any other ways?</span>
            <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">Compare delivery channels</span>
          </button>
          <button
            aria-expanded={topic === 'layers'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              topic === 'layers'
                ? 'border-h26-green/40 bg-h26-green/[0.06]'
                : 'border-black/10 hover:border-h26-green/30 hover:bg-h26-green/[0.03]'
            }`}
            onClick={() => setTopic(topic === 'layers' ? null : 'layers')}
            type="button"
          >
            <span className="block text-[0.82rem] font-medium text-h26-text">Additional auth checks?</span>
            <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">Build a stronger policy</span>
          </button>
          <button
            aria-expanded={topic === 'attack'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              topic === 'attack'
                ? 'border-red-300 bg-red-50/60'
                : 'border-black/10 hover:border-red-200 hover:bg-red-50/30'
            }`}
            onClick={() => setTopic(topic === 'attack' ? null : 'attack')}
            type="button"
          >
            <span className="block text-[0.82rem] font-medium text-h26-text">What if the token is compromised?</span>
            <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">Test loss, theft, and remediation</span>
          </button>
          <button
            aria-expanded={topic === 'stuffing'}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              topic === 'stuffing'
                ? 'border-red-300 bg-red-50/60'
                : 'border-black/10 hover:border-red-200 hover:bg-red-50/30'
            }`}
            onClick={() => setTopic(topic === 'stuffing' ? null : 'stuffing')}
            type="button"
          >
            <span className="block text-[0.82rem] font-medium text-h26-text">
              What if fake voters and votes are added?
            </span>
            <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">
              Ballot stuffing & voter-roll attacks
            </span>
          </button>
        </div>

        {topic === 'token' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              The invitation’s job is to get each voter their Auth Token — the one-time credential that lets them cast.
              Yours in this demo: <span className="font-medium font-mono26 text-h26-text">{auth}</span>
            </p>
            <p className="mt-4 text-[0.78rem] font-medium text-h26-text">Key Properties of Voter Auth Tokens</p>
            <ul className="mt-2 space-y-1.5">
              {authTokenProperties.map((item) => (
                <li className="flex gap-2 text-[0.78rem] text-h26-textSecondary" key={item}>
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-h26-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.72rem]">
              <a className="text-h26-green hover:underline" href="/faq#1p1v" target="_blank">
                How does SIV ensure One Vote per Person?
              </a>
            </p>
          </div>
        )}

        {topic === 'delivery' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Postal mail is familiar, tied to a registered address, and can match today’s paper process. It is one
              delivery channel—not a requirement of SIV.
            </p>
            <p className="mt-4 text-[0.78rem] font-medium text-h26-text">Other ways to deliver an Auth Token:</p>
            <div className="grid gap-2 mt-2 sm:grid-cols-3">
              {[
                ['Email or SMS', 'Fast and affordable when contact details are already verified'],
                ['Secure digital channel', 'Use an existing government or organization account'],
                ['In person', 'Useful for high-assurance or replacement credentials'],
              ].map(([label, description]) => (
                <div className="px-3 py-2 bg-white rounded-lg border border-black/[0.07]" key={label}>
                  <p className="text-[0.76rem] font-medium text-h26-text">{label}</p>
                  <p className="mt-0.5 text-[0.68rem] text-h26-textSecondary">{description}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.72rem] text-h26-textSecondary">
              Jurisdictions can combine channels or choose different ones for different voters.
            </p>
          </div>
        )}

        {topic === 'layers' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Delivery gets the credential to the voter. Additional checks can raise confidence that the intended voter
              is the person using it.
            </p>
            <p className="mt-4 text-[0.78rem] font-medium text-h26-text">Build an authentication policy:</p>
            <div className="grid gap-2 mt-2 sm:grid-cols-2">
              {authLayers.map(([label, description]) => (
                <button
                  aria-pressed={layers.has(label)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    layers.has(label)
                      ? 'border-h26-green/40 bg-white text-h26-text'
                      : 'border-black/[0.07] bg-white/60 text-h26-textSecondary hover:border-h26-green/30'
                  }`}
                  key={label}
                  onClick={() =>
                    setLayers((prev) => {
                      const next = new Set(prev)
                      if (next.has(label)) next.delete(label)
                      else next.add(label)
                      return next
                    })
                  }
                  type="button"
                >
                  <span className="block text-[0.76rem] font-medium">
                    {layers.has(label) ? '✓ ' : '+ '}
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[0.68rem] opacity-70">{description}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.72rem] text-h26-textSecondary">
              Policy: Postal invitation
              {[...layers].map((layer) => ` + ${layer}`).join('')}
            </p>
            <p className="mt-3 text-[0.72rem]">
              <a className="text-h26-green hover:underline" href="/protocol#1" target="_blank">
                Protocol
              </a>
              {' · '}
              <a
                className="text-h26-green hover:underline"
                href="https://docs.siv.org/authentication"
                rel="noreferrer"
                target="_blank"
              >
                Authentication details
              </a>
            </p>
          </div>
        )}

        {topic === 'attack' && (
          <div className="p-4 mt-3 rounded-xl bg-red-50/60">
            <p className="text-[0.78rem] font-medium text-h26-text">Choose an attack:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                ['lost', 'Token lost or stolen'],
                ['used', 'Someone voted first'],
              ].map(([id, label]) => (
                <button
                  aria-pressed={attack === id}
                  className={`rounded-full border px-3 py-2 text-[0.72rem] transition-colors ${
                    attack === id
                      ? 'border-red-300 bg-white font-medium text-red-800'
                      : 'border-red-200/70 bg-white/60 text-h26-textSecondary hover:border-red-300'
                  }`}
                  key={id}
                  onClick={() => {
                    setAttack(id as 'lost' | 'used')
                    setRemediated(false)
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {attack && !remediated && (
              <div className="pl-3 mt-4 border-l-2 border-red-300">
                <p className="text-[0.78rem] font-medium text-red-800">
                  {attack === 'lost'
                    ? 'Until it is revoked, whoever holds the token could try to vote.'
                    : 'The one-use rule rejects your attempt because the token was already used.'}
                </p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  The admin re-authenticates the voter, invalidates the old credential and any linked submission, then
                  issues a replacement. Every change leaves an audit trail.
                </p>
                <SecondaryButton className="mt-3" onClick={() => setRemediated(true)}>
                  Revoke + issue replacement
                </SecondaryButton>
              </div>
            )}

            {attack && remediated && (
              <div className="px-3 py-3 mt-4 bg-white rounded-lg border border-h26-green/30">
                <p className="text-[0.78rem] font-medium text-h26-green">Threat remediated</p>
                <p className="mt-2 font-mono26 text-[0.72rem] text-h26-muted line-through">Old: {auth}</p>
                <p className="mt-1 font-mono26 text-[0.78rem] text-h26-text">Replacement: {replacementAuth}</p>
                <p className="mt-2 text-[0.7rem] text-h26-textSecondary">
                  The old token is rejected; the voter can cast once with the replacement.
                </p>
              </div>
            )}
          </div>
        )}

        {topic === 'stuffing' && (
          <div className="p-4 mt-3 rounded-xl bg-red-50/60">
            <p className="text-[0.78rem] font-medium text-h26-text">Choose an attack:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                ['roll', 'Fake voters on the roll'],
                ['guess', 'Invented Auth Tokens'],
                ['reuse', 'Extra submissions'],
              ].map(([id, label]) => (
                <button
                  aria-pressed={stuffing === id}
                  className={`rounded-full border px-3 py-2 text-[0.72rem] transition-colors ${
                    stuffing === id
                      ? 'border-red-300 bg-white font-medium text-red-800'
                      : 'border-red-200/70 bg-white/60 text-h26-textSecondary hover:border-red-300'
                  }`}
                  key={id}
                  onClick={() => setStuffing(id as 'guess' | 'reuse' | 'roll')}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {stuffing && (
              <div className="pl-3 mt-4 border-l-2 border-red-300">
                <p className="text-[0.78rem] font-medium text-red-800">
                  {stuffing === 'roll' && 'Padding the voter roll with fake people.'}
                  {stuffing === 'guess' && 'Trying to invent Auth Tokens that were never issued.'}
                  {stuffing === 'reuse' && 'Submitting without a token, or reusing one already accepted.'}
                </p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  {stuffing === 'roll' &&
                    'Eligibility is still a voter-roll problem — same as paper. The roll can be audited. SIV does not invent who is allowed to vote; it binds each accepted ciphertext to a registered token.'}
                  {stuffing === 'guess' &&
                    'Tokens are generated by the election admin and infeasible to guess. Submissions with unknown tokens are rejected.'}
                  {stuffing === 'reuse' &&
                    'One Auth Token → one accepted ciphertext. A second use is rejected, and every accepted submission is visible on the public board for audit.'}
                </p>
                <div className="px-3 py-3 mt-3 bg-white rounded-lg border border-h26-green/30">
                  <p className="text-[0.78rem] font-medium text-h26-green">
                    {stuffing === 'roll' && 'Defense: audit the voter roll'}
                    {stuffing === 'guess' && 'Defense: only issued tokens are accepted'}
                    {stuffing === 'reuse' && 'Defense: one token, one accepted vote'}
                  </p>
                </div>
              </div>
            )}

            <p className="mt-3 text-[0.72rem]">
              <a className="text-h26-green hover:underline" href="/faq#1p1v" target="_blank">
                How does SIV ensure One Vote per Person?
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function joinChoices(choices: string[]) {
  return [...choices].sort().join(', ')
}

function Malware({
  choice,
  confirmed,
  device1Tampered,
  onConfirm,
  onContinue,
  onSkip,
  onTamper,
  verification,
}: {
  choice: string
  confirmed: boolean
  device1Tampered: boolean
  onConfirm: () => void
  onContinue: () => void
  onSkip: () => void
  onTamper: () => void
  verification: string
}) {
  const approved = splitChoices(choice)
  const device1Choice = device1Tampered ? CANDIDATES.find((c) => !approved.includes(c)) || CANDIDATES[0] : choice
  const mismatch = device1Tampered

  return (
    <div>
      <p className="mb-4 text-[0.85rem] text-h26-textSecondary">
        In production this is a QR → second phone. Here both devices are on one screen so you can attack Device 1.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <DeviceFrame label="Device 1 — voting laptop" warn={mismatch}>
          <p className="text-[0.8rem] text-h26-textSecondary">Shows:</p>
          <p className="mt-1 font-medium">{device1Choice}</p>
          <p className="mt-2 font-mono26 text-[0.7rem] text-h26-muted">{verification}</p>
          {!device1Tampered ? (
            <SecondaryButton className="mt-4 w-full" onClick={onTamper}>
              Simulate malware swap
            </SecondaryButton>
          ) : (
            <p className="mt-4 text-[0.75rem] font-medium text-red-700">Malware rewrote the display</p>
          )}
        </DeviceFrame>
        <DeviceFrame label="Device 2 — malware check" ok={!mismatch || confirmed}>
          <p className="text-[0.8rem] text-h26-textSecondary">Independent decrypt:</p>
          <p className="mt-1 font-medium">{choice}</p>
          <p className="mt-2 font-mono26 text-[0.7rem] text-h26-muted">{verification}</p>
          {mismatch ? (
            <p className="mt-4 text-[0.75rem] font-medium text-red-700">Mismatch — reject this cast</p>
          ) : (
            <p className="mt-4 text-[0.75rem] font-medium text-h26-green">Matches Device 1</p>
          )}
        </DeviceFrame>
      </div>
      <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
        {mismatch && !confirmed && <PrimaryButton onClick={onConfirm}>Reject tampered vote (confirmed)</PrimaryButton>}
        {(!mismatch || confirmed) && <PrimaryButton onClick={onContinue}>Next: update Verification #</PrimaryButton>}
        <SecondaryButton onClick={onSkip}>Skip to coercion</SecondaryButton>
      </div>
    </div>
  )
}

function markComplete(prev: DemoState, ids: string[] = []): DemoState {
  if (!ids.length) return prev
  const completed = new Set(prev.completed)
  ids.forEach((id) => completed.add(id))
  return { ...prev, completed }
}

function NeedVote({ label, onStart }: { label?: string; onStart: () => void }) {
  return (
    <div>
      <p className="text-[0.9rem] text-h26-textSecondary">
        {label || 'Cast a vote first so this room has something to show.'}
      </p>
      <PrimaryButton className="mt-5" onClick={onStart}>
        Start as a voter
      </PrimaryButton>
    </div>
  )
}

function PrimaryButton({
  children,
  className = '',
  disabled,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`inline-flex w-full items-center justify-center rounded-full border border-h26-green/40 bg-h26-green/[0.08] px-5 py-3 text-[0.88rem] font-medium text-h26-green no-underline shadow-sm transition-colors hover:border-h26-green/70 hover:bg-h26-green/[0.14] hover:text-h26-green disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${className}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function Row({
  className = '',
  emphasize,
  label,
  mono,
  value,
}: {
  className?: string
  emphasize?: boolean
  label: string
  mono?: boolean
  value: string
}) {
  return (
    <div className={`px-4 py-3 rounded-xl bg-h26-bg ${className}`}>
      <div className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">{label}</div>
      <div
        className={`mt-1 break-all text-[0.85rem] ${mono ? 'font-mono26' : ''} ${
          emphasize ? 'font-medium text-h26-green' : 'text-h26-text'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function SecondaryButton({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => void
}) {
  return (
    <button
      className={`inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-[0.85rem] font-medium text-h26-textSecondary no-underline transition-colors hover:border-h26-green/40 hover:bg-h26-green/[0.06] hover:text-h26-green sm:w-auto ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function splitChoices(choice: string) {
  return choice.split(', ').filter(Boolean)
}

function Strengthen({
  digits,
  onChangeDigits,
  onContinue,
  onSkip,
  onStrengthen,
  original,
  preview,
  strengthened,
}: {
  digits: string
  onChangeDigits: (d: string) => void
  onContinue: () => void
  onSkip: () => void
  onStrengthen: () => void
  original: string
  preview: null | string
  strengthened: null | string
}) {
  return (
    <div>
      <p className="text-[0.85rem] text-h26-textSecondary">
        Write down your current # first. Then pick 4 digits only you know — a cast-time screenshot goes stale.
      </p>
      <Row className="mt-4" label="Current Verification #" mono value={original} />
      {!strengthened ? (
        <>
          <label className="mt-4 block text-[0.8rem] font-medium text-h26-text">
            Your 4 digits
            <input
              className="mt-1 block w-36 rounded-lg border border-black/15 px-3 py-2 font-mono26 tracking-[0.3em]"
              inputMode="numeric"
              maxLength={4}
              onChange={(e) => onChangeDigits(e.target.value)}
              placeholder="····"
              value={digits}
            />
          </label>
          {preview && <Row className="mt-3" emphasize label="New Verification #" mono value={preview} />}
          <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
            <PrimaryButton disabled={!preview} onClick={onStrengthen}>
              Update number
            </PrimaryButton>
            <SecondaryButton onClick={onSkip}>Skip</SecondaryButton>
          </div>
        </>
      ) : (
        <>
          <Row className="mt-4" emphasize label="Updated Verification #" mono value={strengthened} />
          <p className="mt-3 text-[0.8rem] text-h26-green">
            Old screenshots no longer match the # that will appear in the unlocked tally.
          </p>
          <PrimaryButton className="mt-5" onClick={onContinue}>
            Continue to coercion room
          </PrimaryButton>
        </>
      )}
    </div>
  )
}

function Submit({
  boardVotes,
  onAudit,
  onCoercion,
  onMalware,
  onUnlock,
}: {
  boardVotes: { auth: string; cipher: string; name: string; yours: boolean }[]
  onAudit: () => void
  onCoercion: () => void
  onMalware: () => void
  onUnlock: () => void
}) {
  return (
    <div>
      <p className="mb-3 text-[0.85rem] font-medium text-h26-green">Accepted — on the public board</p>
      <div className="overflow-x-auto rounded-xl border border-black/8">
        <table className="w-full min-w-[480px] text-left text-[0.78rem]">
          <thead className="bg-black/[0.03] text-h26-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Voter / Auth</th>
              <th className="px-3 py-2 font-medium">Encrypted vote</th>
            </tr>
          </thead>
          <tbody>
            {boardVotes.map((v) => (
              <tr className={v.yours ? 'bg-h26-green/[0.07]' : ''} key={v.auth}>
                <td className="px-3 py-2">
                  <div className="font-medium">{v.name}</div>
                  <div className="font-mono26 text-[0.7rem] opacity-60">{v.auth}</div>
                </td>
                <td className="px-3 py-2 font-mono26 text-[0.7rem] text-h26-textSecondary">{v.cipher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-[0.85rem] text-h26-textSecondary">
        Happy path continues to unlock — or open a defense room first.
      </p>

      <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onUnlock}>Close election & unlock</PrimaryButton>
        <SecondaryButton onClick={onMalware}>Try malware defense</SecondaryButton>
        <SecondaryButton onClick={onCoercion}>Try coercion override</SecondaryButton>
        <SecondaryButton onClick={onAudit}>Auditor view</SecondaryButton>
      </div>
    </div>
  )
}

function Unlock({ onContinue, unlocked }: { onContinue: () => void; unlocked: UnlockedVote[] }) {
  return (
    <div>
      <ol className="mb-5 space-y-2 text-[0.85rem] text-h26-textSecondary">
        <li>✓ Auth tokens stripped</li>
        <li>✓ Privacy Protectors shuffle + re-encrypt (mixnet)</li>
        <li>✓ Threshold unlock — vote contents public, identities unlinked</li>
      </ol>
      <div className="max-h-56 overflow-auto rounded-xl bg-h26-bg px-4 py-3 font-mono26 text-[0.72rem]">
        {unlocked.map((v) => (
          <div className={v.yours ? 'font-medium text-h26-green' : ''} key={v.verification}>
            {`{ mayor: ${formatMayor(v.choice)}, verification: '${v.verification}' }`}
            {v.yours ? '  ← yours' : ''}
          </div>
        ))}
      </div>
      <PrimaryButton className="mt-5" onClick={onContinue}>
        Find your Verification #
      </PrimaryButton>
    </div>
  )
}

function Verify({
  activeVerification,
  buyerScreenshot,
  onAudit,
  onDone,
  overridden,
  search,
  searchHit,
  setSearch,
  tallies,
  unlocked,
}: {
  activeVerification: string
  buyerScreenshot: null | string
  onAudit: () => void
  onDone: () => void
  overridden: boolean
  search: string
  searchHit: false | undefined | UnlockedVote
  setSearch: (s: string) => void
  tallies: [string, number][]
  unlocked: UnlockedVote[]
}) {
  return (
    <div>
      <label className="block text-[0.8rem] font-medium">
        Search unlocked votes
        <input
          className="block px-3 py-2 mt-1 w-full max-w-sm rounded-lg border border-black/15 font-mono26"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Verification #"
          value={search}
        />
      </label>

      {searchHit ? (
        <div className="mt-4 rounded-xl bg-h26-green/[0.1] px-4 py-3">
          <p className="text-[0.85rem] font-medium text-h26-green">Found — counted as intended</p>
          <p className="mt-1 font-mono26 text-[0.8rem]">
            {searchHit.verification} → {searchHit.choice}
          </p>
        </div>
      ) : search.trim().length >= 4 ? (
        <p className="mt-4 text-[0.85rem] text-red-700">No match in unlocked list.</p>
      ) : null}

      {overridden && buyerScreenshot && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[0.8rem]">
          <p className="font-medium text-red-800">Buyer’s screenshot: {buyerScreenshot}</p>
          <p className="mt-1 text-red-800/80">
            {unlocked.some((v) => v.verification === buyerScreenshot)
              ? 'Still present (unexpected in this demo)'
              : 'Not in the unlocked tally — coercion failed for the buyer.'}
          </p>
          <p className="mt-1 text-h26-textSecondary">Your real #: {activeVerification}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="text-[0.8rem] font-medium">Anyone can re-tally:</p>
        <ul className="mt-2 space-y-1 text-[0.85rem]">
          {tallies.map(([name, n]) => (
            <li key={name}>
              {name}: <b>{n}</b>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onDone}>Finish</PrimaryButton>
        <SecondaryButton onClick={onAudit}>Auditor view</SecondaryButton>
      </div>
    </div>
  )
}

function visit(prev: DemoState, step: DemoStep): DemoState {
  if (prev.step === step) return prev
  return { ...prev, future: [], history: [...prev.history, prev.step], step }
}

function Vote({ onPick }: { onPick: (c: string) => void }) {
  const [method, setMethod] = useState<BallotMethod>('approval')
  const [plaintext, setPlaintext] = useState<Record<string, string>>({})
  const design = useMemo(() => ballotDesignFor(method), [method])
  const state: VoteState = {
    ballot_design: [design],
    ballot_design_finalized: true,
    encoded: {},
    encrypted: {},
    plaintext,
    public_key: 'demo',
    randomizer: {},
  }
  const dispatch = (payload: Record<string, string>) => setPlaintext((prev) => ({ ...prev, ...payload }))
  const choice = choiceFromPlaintext(method, plaintext)

  return (
    <div>
      {/* Same type routing as src/vote/Ballot.tsx */}
      {method === 'approval' && (
        <MultiVoteItem
          {...design}
          dispatch={dispatch}
          multiple_votes_allowed={DEMO_BALLOT_OPTIONS.length}
          options={DEMO_BALLOT_OPTIONS}
          state={state}
        />
      )}
      {method === 'multi' && (
        <MultiVoteItem
          {...design}
          dispatch={dispatch}
          multiple_votes_allowed={default_multiple_votes_allowed}
          options={DEMO_BALLOT_OPTIONS}
          state={state}
        />
      )}
      {method === 'plurality' && <Item {...design} dispatch={dispatch} options={DEMO_BALLOT_OPTIONS} state={state} />}
      {method === 'ranked' && (
        <RankedChoiceItem
          {...design}
          dispatch={dispatch}
          options={DEMO_BALLOT_OPTIONS}
          rankings_allowed={defaultRankingsAllowed}
          state={state}
        />
      )}
      {method === 'score' && <ScoreItem {...design} dispatch={dispatch} options={DEMO_BALLOT_OPTIONS} state={state} />}
      {method === 'budget' && (
        <BudgetItem {...design} dispatch={dispatch} options={DEMO_BALLOT_OPTIONS} state={state} />
      )}

      <PrimaryButton className="mt-2" disabled={!choice} onClick={() => choice && onPick(choice)}>
        Seal & encrypt vote
      </PrimaryButton>

      <div className="mt-6 border-t border-black/[0.07] pt-5">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
          Try other voting methods · optional
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {BALLOT_METHODS.map((m) => (
            <button
              aria-pressed={method === m.id}
              className={`rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors ${
                method === m.id
                  ? 'border-h26-green/40 bg-h26-green/[0.1] font-medium text-h26-green'
                  : 'border-black/10 text-h26-textSecondary hover:border-h26-green/30 hover:text-h26-text'
              }`}
              key={m.id}
              onClick={() => {
                setMethod(m.id)
                setPlaintext({})
              }}
              type="button"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
