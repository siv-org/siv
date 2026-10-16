import { Play, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { strengthenTracking } from 'src/vote/strengthen-tracking'
import { generateTrackingNum } from 'src/vote/tracking-num'

import { CANDIDATES, DemoStep, OTHER_VOTERS, POSTER_PROPERTIES, STEP_META } from './content'
import { back, DemoState, forward, go, initState, markComplete, pathIndex, UnlockedVote, visit } from './demoState'
import { fakeCipher, fakeCipherParts } from './shared/ciphertext'
import { joinChoices, splitChoices } from './shared/formatChoice'
import { NeedVote } from './shared/NeedVote'
import { PrimaryButton } from './shared/PrimaryButton'
import { Audit } from './steps/audit/Audit'
import { Coercion } from './steps/coercion/Coercion'
import { Done } from './steps/done/Done'
import { Intro } from './steps/intro/Intro'
import { Invite } from './steps/invite/Invite'
import { Malware } from './steps/malware/Malware'
import { Strengthen } from './steps/strengthen/Strengthen'
import { Submit } from './steps/submit/Submit'
import { Unlock } from './steps/unlock/Unlock'
import { Verify } from './steps/verify/Verify'
import { Vote } from './steps/vote/Vote'

export function InteractiveDemo() {
  const [s, setS] = useState<DemoState>(initState)

  const activeVerification = s.strengthened || s.verification
  const boardVotes = useMemo(() => {
    if (!s.verification || !s.choice) return []
    const yours = fakeCipherParts(s.verification + s.choice)
    return [
      ...OTHER_VOTERS.map((v) => ({
        auth: v.auth,
        cipher: fakeCipher(v.auth + v.name),
        name: v.name,
        yours: false,
        ...fakeCipherParts(v.auth + v.name),
      })),
      {
        auth: s.auth || 'you····',
        cipher: fakeCipher(s.verification + s.choice),
        name: 'You',
        yours: true,
        ...yours,
      },
    ]
  }, [s.auth, s.choice, s.verification])

  const strengthenPreview =
    s.verification && s.digits.length === 4 ? strengthenTracking(s.verification, s.digits) : null

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
        'submit',
      ),
    )
  }

  const buildUnlocked = (choice: string, verification: string, overridden: boolean): UnlockedVote[] => {
    const others: UnlockedVote[] = OTHER_VOTERS.map((_, i) => ({
      // Approval: each other voter marks two or three candidates
      choice: joinChoices([
        CANDIDATES[i % CANDIDATES.length],
        CANDIDATES[(i + 1) % CANDIDATES.length],
        ...(i % 2 === 0 ? [CANDIDATES[(i + 2) % CANDIDATES.length]] : []),
      ]),
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
      if (!choice || !verification) return visit(prev, 'verify')
      const unlocked = buildUnlocked(choice, verification, prev.overridden)
      return go({ ...prev, search: verification, unlocked }, 'verify')
    })
  }

  const at = pathIndex(s.step)
  const rail: { label: string; mark?: 'play' | 'restart'; n?: number; onClick: () => void }[] = [
    { label: 'Start demo', mark: 'play', onClick: () => setS((prev) => visit(prev, 'intro')) },
    { label: 'Receive invite', n: 1, onClick: () => setS((prev) => visit(prev, 'invite')) },
    { label: 'Vote', n: 2, onClick: () => setS((prev) => visit(prev, 'vote')) },
    { label: 'Verify results', n: 3, onClick: runUnlock },
    { label: 'Restart', mark: 'restart', onClick: restart },
  ]

  const jumpToProperty = (id: string) => {
    const jump: Partial<Record<string, DemoStep>> = {
      coercion: 'coercion',
      'ground-truth': s.unlocked.length ? 'verify' : 'unlock',
      malware: 'malware',
      open: s.unlocked.length ? 'audit' : 'submit',
      privacy: 'vote',
      stuffing: s.unlocked.length ? 'audit' : 'invite',
    }
    const step = jump[id]
    if (step) setS((prev) => visit(prev, step))
  }

  return (
    <NoSsr>
      <div className="demo">
        {/* Path — start and restart bookend steps 1–3 */}
        <ol className="flex mb-8 w-full">
          {rail.map(({ label, mark, n, onClick }, i) => {
            const slot = (n ?? 1) - 1
            const done = !mark && at > slot
            const current = !mark && at === slot
            return (
              <li className="flex relative flex-col flex-1 items-center min-w-0" key={label}>
                {i < rail.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute left-1/2 top-[13.5px] h-px w-full ${
                      at >= i ? 'bg-h26-green/60' : 'bg-black/10'
                    }`}
                  />
                )}
                <button
                  aria-current={current || (i === 0 && s.step === 'intro') ? 'step' : undefined}
                  className="relative z-10 flex w-full flex-col items-center gap-2 bg-transparent px-0.5"
                  onClick={onClick}
                  type="button"
                >
                  <span
                    className={`box-border flex size-7 items-center justify-center rounded-full ${
                      done
                        ? 'text-white bg-h26-green'
                        : current
                        ? 'border-2 border-h26-green bg-h26-bg'
                        : 'border border-black/15 bg-h26-bg'
                    }`}
                  >
                    {mark === 'play' ? (
                      <Play aria-hidden className="ml-px size-3 text-black/45" strokeWidth={2.25} />
                    ) : mark === 'restart' ? (
                      <RotateCcw aria-hidden className="size-3.5 text-black/45" strokeWidth={2} />
                    ) : (
                      <span
                        className={`text-[0.7rem] font-medium ${
                          done ? 'text-white' : current ? 'text-h26-green' : 'text-black/35'
                        }`}
                      >
                        {n}
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-center text-[0.7rem] leading-tight sm:text-[0.8rem] ${
                      mark
                        ? 'text-h26-muted'
                        : current
                        ? 'font-medium text-h26-text'
                        : done
                        ? 'text-h26-text'
                        : 'text-h26-muted'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
          {/* Main stage first on phone */}
          <section className="order-1 min-w-0 lg:order-2">
            <header className="mb-5 sm:mb-6">
              <p className="font-mono26 mb-2 text-[10px] uppercase tracking-[0.16em] text-h26-muted">
                SIV Interactive Demo
              </p>
              <h1
                className={`font-serif26 font-normal tracking-tight text-h26-text ${
                  s.step === 'intro'
                    ? 'text-[clamp(1.15rem,2.4vw,1.45rem)] leading-snug'
                    : 'text-[clamp(1.35rem,5vw,2.1rem)]'
                }`}
              >
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
              {s.step === 'submit' &&
                (s.choice && s.verification ? (
                  <Submit
                    auth={s.auth}
                    boardVotes={boardVotes}
                    choice={s.choice}
                    onCoercion={() => setS((prev) => go(prev, 'coercion'))}
                    onMalware={() => setS((prev) => go(prev, 'malware'))}
                    onSeeResults={() => setS((prev) => visit(prev, 'verify'))}
                    onStrengthen={() => setS((prev) => go(prev, 'strengthen'))}
                    onUnlock={runUnlock}
                    published={!!s.unlocked.length}
                    verification={s.verification}
                  />
                ) : (
                  <NeedVote onStart={start} />
                ))}
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
                    boardVotes={boardVotes}
                    onDone={() => setS((prev) => go(prev, 'done'))}
                    unlocked={s.unlocked}
                  />
                ) : (
                  <NeedVote label="Cast a vote first so there are results to check." onStart={start} />
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
              Achieved properties
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
