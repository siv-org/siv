import { useState } from 'react'

import { CANDIDATES } from '../../content'
import { joinChoices, splitChoices } from '../../shared/formatChoice'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function Coercion({
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
