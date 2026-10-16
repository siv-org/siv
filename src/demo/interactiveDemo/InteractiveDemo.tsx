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

  const pathSteps: [DemoStep, string][] = [
    ['invite', 'Receive invite'],
    ['vote', 'Vote'],
    ['verify', 'Verify results'],
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
        {/* Path + restart — timeline of the voter flow */}
        <div className="flex gap-3 items-center mb-5 sm:mb-6">
          <ol className="flex flex-1 items-center min-w-0">
            {pathSteps.map(([id, label], i) => {
              const at = pathIndex(s.step)
              const current = at === i
              const done = at > i
              return (
                <li className={`flex items-center ${i < pathSteps.length - 1 ? 'flex-1' : 'shrink-0'}`} key={id}>
                  <button
                    aria-current={current ? 'step' : undefined}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.72rem] transition-colors ${
                      current
                        ? 'border border-h26-green font-medium text-h26-green'
                        : `border border-transparent hover:bg-h26-green/[0.06] hover:text-h26-green ${done ? 'text-h26-green' : 'text-h26-textSecondary'}`
                    }`}
                    onClick={() => (id === 'verify' ? runUnlock() : setS((prev) => visit(prev, id)))}
                    type="button"
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        current
                          ? 'border border-h26-green bg-white'
                          : done
                            ? 'bg-h26-green'
                            : 'border border-black/20 bg-white'
                      }`}
                    />
                    {label}
                  </button>
                  {i < pathSteps.length - 1 && (
                    <span className={`mx-1.5 h-px min-w-[10px] flex-1 ${done ? 'bg-h26-green/40' : 'bg-black/10'}`} />
                  )}
                </li>
              )
            })}
          </ol>
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
