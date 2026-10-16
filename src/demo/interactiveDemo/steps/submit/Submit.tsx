import { PenLine, Smartphone } from 'lucide-react'
import { useState } from 'react'

import { CANDIDATES } from '../../content'
import { fakeCipher, fakeCipherParts } from '../../shared/ciphertext'
import { ExpandableHex } from '../../shared/ExpandableHex'
import { formatMayor, splitChoices } from '../../shared/formatChoice'
import { LabeledRow } from '../../shared/LabeledRow'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { PublicBoard } from '../../shared/PublicBoard'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function Submit({
  auth,
  boardVotes,
  choice,
  onCoercion,
  onMalware,
  onSeeResults,
  onStrengthen,
  onUnlock,
  published,
  verification,
}: {
  auth: string
  boardVotes: { auth: string; cipher: string; encrypted: string; lock: string; name: string; yours: boolean }[]
  choice: string
  onCoercion: () => void
  onMalware: () => void
  onSeeResults: () => void
  onStrengthen: () => void
  onUnlock: () => void
  published: boolean
  verification: string
}) {
  const [topic, setTopic] = useState<'board' | 'lose' | 'swap' | 'verification' | null>(null)
  const [swapPhase, setSwapPhase] = useState<'caught' | 'idle' | 'infected'>('idle')
  const [showStatus, setShowStatus] = useState(false)
  const [malwareOpen, setMalwareOpen] = useState(false)
  const [showEncryptionDetails, setShowEncryptionDetails] = useState(false)
  const [expandedHex, setExpandedHex] = useState<'encrypted' | 'lock' | null>(null)
  const shownChoice = splitChoices(choice)[0] || CANDIDATES[0]
  const swappedChoice = CANDIDATES.find((c) => c !== shownChoice) || CANDIDATES[1]
  // After infection, ciphertext encodes the swapped choice until a real remediation path
  const sealedChoice = swapPhase === 'idle' ? null : swappedChoice
  const cipherSeed = verification + (sealedChoice || choice)
  const { encrypted, lock } = fakeCipherParts(verification + choice)

  return (
    <div>
      {/* Same content as SubmittedScreen, styled in demo green language; defense rooms stay separate steps */}
      <h2 className="font-serif26 text-[1.5rem] font-normal tracking-tight text-h26-text sm:text-[1.7rem]">
        Vote Submitted.
      </h2>

      <button
        className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-h26-green underline-offset-2 hover:underline"
        onClick={() => (published ? onSeeResults() : setShowStatus((v) => !v))}
        type="button"
      >
        {published || !showStatus ? 'See' : 'Hide'} Election Status page →
      </button>

      {!published && showStatus && (
        <div className="mt-4 rounded-xl border border-black/[0.07] bg-white px-4 py-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] sm:px-5">
          <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">Election Status</p>
          <h3 className="mt-1 text-[1.05rem] font-medium text-h26-text">All Submitted Votes</h3>
          <p className="mt-1 text-[0.8rem] italic text-h26-textSecondary">
            Ordered oldest to newest. When the election closes, these votes will be shuffled and then unlocked.
          </p>
          <p className="mt-2 text-[0.75rem] text-h26-muted">
            {boardVotes.length} encrypted submissions · yours highlighted
          </p>
          <PublicBoard votes={boardVotes} />
        </div>
      )}

      <div className="mt-6">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">How to verify</p>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-h26-textSecondary">
          Once the election closes and votes are published, find your vote on the Election Status page using its{' '}
          <em>Verification #</em>:
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-black/[0.07]">
          <table className="w-full min-w-[280px] text-left text-[0.78rem]">
            <thead className="bg-black/[0.03] text-h26-muted">
              <tr>
                <th className="px-3 py-2 font-medium">verification #</th>
                <th className="px-3 py-2 font-medium">mayor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-h26-green/[0.1]">
                <td className="px-3 py-2.5 font-mono26 font-medium text-h26-green">{verification}</td>
                <td className="px-3 py-2.5 text-h26-text">{formatMayor(choice)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[0.72rem] leading-relaxed text-h26-muted">
          This secret <em>Verification #</em> is a random number, generated and encrypted on your own device. No one
          else can possibly know it.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-black/[0.07] bg-h26-bg/60 px-4 py-4">
        <button
          className="flex gap-3 justify-between items-center w-full text-left"
          onClick={() => setMalwareOpen((v) => !v)}
          type="button"
        >
          <span>
            <span className="block text-[0.85rem] font-medium text-h26-text">
              Verify your vote wasn&apos;t changed by malware
            </span>
            <span className="mt-0.5 block text-[0.72rem] text-h26-textSecondary">
              Second device check or update your Verification #
            </span>
          </span>
          <span className="font-mono26 text-[0.75rem] text-h26-muted">{malwareOpen ? '−' : '+'}</span>
        </button>
        {malwareOpen && (
          <div className="grid gap-2 mt-3 sm:grid-cols-2">
            <button
              className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 py-3 text-left transition-colors hover:border-h26-green/40 hover:bg-h26-green/[0.04]"
              onClick={onMalware}
              type="button"
            >
              <Smartphone className="size-4 shrink-0 text-h26-green" strokeWidth={1.75} />
              <span>
                <span className="block text-[0.8rem] font-medium text-h26-text">Check with another device</span>
                <span className="mt-0.5 block text-[0.68rem] text-h26-textSecondary">Independent decrypt</span>
              </span>
            </button>
            <button
              className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 py-3 text-left transition-colors hover:border-h26-green/40 hover:bg-h26-green/[0.04]"
              onClick={onStrengthen}
              type="button"
            >
              <PenLine className="size-4 shrink-0 text-h26-green" strokeWidth={1.75} />
              <span>
                <span className="block text-[0.8rem] font-medium text-h26-text">Customize Verification #</span>
                <span className="mt-0.5 block text-[0.68rem] text-h26-textSecondary">Update last 4 digits</span>
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">How it was submitted</p>
        <p className="mt-2 text-[0.9rem] text-h26-textSecondary">
          Encrypted on your device before anything left — the admin can accept it without learning your choices.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-black/[0.07]">
          <table className="w-full min-w-[320px] text-left text-[0.78rem]">
            <thead className="bg-black/[0.03] text-h26-muted">
              <tr>
                <th className="px-3 py-2 font-medium">auth</th>
                <th className="px-3 py-2 font-medium">encrypted</th>
                <th className="px-3 py-2 font-medium">lock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2.5 font-mono26">{auth}</td>
                <td className="px-3 py-2.5">
                  <ExpandableHex
                    expanded={expandedHex === 'encrypted'}
                    onToggle={() => setExpandedHex(expandedHex === 'encrypted' ? null : 'encrypted')}
                    value={encrypted}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <ExpandableHex
                    expanded={expandedHex === 'lock'}
                    onToggle={() => setExpandedHex(expandedHex === 'lock' ? null : 'lock')}
                    value={lock}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[0.72rem] text-h26-muted">
          Contents unlock only after the election closes and votes are shuffled for anonymization.
        </p>

        <button
          className="mt-3 text-[0.75rem] font-medium text-h26-green underline-offset-2 hover:underline"
          onClick={() => setShowEncryptionDetails((v) => !v)}
          type="button"
        >
          {showEncryptionDetails ? 'Hide' : 'Show'} encryption details
        </button>

        {showEncryptionDetails && (
          <div className="px-4 py-4 mt-3 space-y-3 rounded-xl bg-h26-bg">
            <LabeledRow label="Election" value="City Mayoral Election" />
            <LabeledRow label="Auth token" mono value={auth} />
            <LabeledRow emphasize label="Verification #" mono value={verification} />
            <LabeledRow label="Plaintext (device only)" value={`{ mayor: ${formatMayor(choice)} }`} />
            <LabeledRow label="Ciphertext" mono value={fakeCipher(verification + choice)} />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-2 border-t border-black/[0.07] pt-5 sm:flex-row sm:flex-wrap">
        <PrimaryButton onClick={onUnlock}>Close election & announce results</PrimaryButton>
        <SecondaryButton onClick={onMalware}>Try malware defense</SecondaryButton>
        <SecondaryButton onClick={onCoercion}>Try coercion override</SecondaryButton>
      </div>

      <div className="mt-8 border-t border-black/[0.07] pt-5">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
          Explore this step · optional
        </p>
        <div className="grid gap-2 mt-3 sm:grid-cols-2">
          {(
            [
              ['verification', 'What’s a Verification #?', 'Your private receipt for later'],
              ['swap', 'UI said John — Bob was sealed?', 'Client-side swap attack'],
              ['board', 'What’s on the public board?', 'Ciphertexts, not choices'],
              ['lose', 'What if I lose my #?', 'Still recoverable'],
            ] as const
          ).map(([id, title, subtitle]) => {
            const attack = id === 'swap'
            const open = topic === id
            return (
              <button
                aria-expanded={open}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  open
                    ? attack
                      ? 'border-red-300 bg-red-50/60'
                      : 'border-h26-green/40 bg-h26-green/[0.06]'
                    : attack
                    ? 'border-black/10 hover:border-red-200 hover:bg-red-50/30'
                    : 'border-black/10 hover:border-h26-green/30 hover:bg-h26-green/[0.03]'
                }`}
                key={id}
                onClick={() => {
                  setTopic(open ? null : id)
                  if (id === 'swap' && !open) setSwapPhase('idle')
                }}
                type="button"
              >
                <span className="block text-[0.82rem] font-medium text-h26-text">{title}</span>
                <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">{subtitle}</span>
              </button>
            )
          })}
        </div>

        {topic === 'verification' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Think of it as a secret lottery ticket printed on your device at cast time. After unlock, you search the
              public list for <span className="font-medium font-mono26 text-h26-text">{verification}</span> and confirm
              the choices next to it match what you intended.
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                'Generated randomly on your device — not assigned by the server',
                'Encrypted inside the same sealed vote, so it travels with your choices',
                'Known only to you (and anyone you show it to)',
                'Enough to find your row later without revealing who you are',
              ].map((item) => (
                <li className="flex gap-2 text-[0.78rem] text-h26-textSecondary" key={item}>
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-h26-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {topic === 'swap' && (
          <div className="p-4 mt-3 rounded-xl bg-red-50/60">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Classic attack: malware (or a malicious app) shows you selecting{' '}
              <b className="text-h26-text">{shownChoice}</b>, then seals{' '}
              <b className="text-h26-text">{swappedChoice}</b> instead. The screen can lie — the ciphertext can’t
              rewrite history once accepted.
            </p>

            <div className="grid gap-3 mt-4 sm:grid-cols-2">
              <div className="px-3 py-3 bg-white rounded-lg border border-black/[0.07]">
                <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
                  What Device 1 shows
                </p>
                <p className="mt-2 text-[0.85rem] font-medium text-h26-text">{shownChoice}</p>
                <p className="mt-1 font-mono26 text-[0.7rem] text-h26-muted">{verification}</p>
                <p className="mt-2 text-[0.7rem] text-h26-textSecondary">Looks fine. Always does.</p>
              </div>
              <div
                className={`rounded-lg border px-3 py-3 ${
                  sealedChoice ? 'border-red-300 bg-red-50' : 'border-black/[0.07] bg-white'
                }`}
              >
                <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
                  What actually sealed
                </p>
                <p className="mt-2 text-[0.85rem] font-medium text-h26-text">{sealedChoice || '???'}</p>
                <p className="mt-1 font-mono26 text-[0.65rem] leading-snug text-h26-muted">{fakeCipher(cipherSeed)}</p>
              </div>
            </div>

            {swapPhase === 'idle' && (
              <SecondaryButton className="mt-4" onClick={() => setSwapPhase('infected')}>
                Infect Device 1 — swap the seal
              </SecondaryButton>
            )}

            {swapPhase === 'infected' && (
              <div className="pl-3 mt-4 border-l-2 border-red-300">
                <p className="text-[0.78rem] font-medium text-red-800">
                  Device 1 still shows {shownChoice}. The board accepted a ciphertext for {swappedChoice}.
                </p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  You catch this by checking on a <em>second</em> device (independent decrypt of what was sealed), or
                  later by finding your Verification # in the unlocked tally. If it doesn’t match, you can raise it —
                  with evidence.
                </p>
                <div className="flex flex-col gap-2 mt-3 sm:flex-row">
                  <SecondaryButton onClick={onMalware}>Try the second-device check</SecondaryButton>
                  <SecondaryButton onClick={() => setSwapPhase('caught')}>
                    Skip ahead: unlock catches it
                  </SecondaryButton>
                </div>
              </div>
            )}

            {swapPhase === 'caught' && (
              <div className="px-3 py-3 mt-4 bg-white rounded-lg border border-h26-green/30">
                <p className="text-[0.78rem] font-medium text-h26-green">Caught after unlock</p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  Searching <span className="font-mono26 text-h26-text">{verification}</span> would show{' '}
                  <b>{swappedChoice}</b> — not what Device 1 displayed. Computers aren’t ground truth; your check is.
                </p>
              </div>
            )}
          </div>
        )}

        {topic === 'board' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="mb-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Same public board as Election Status: auth + encrypted + lock. Choices stay sealed until shuffle & unlock.
            </p>
            <PublicBoard votes={boardVotes} />
            <button
              className="mt-3 text-[0.75rem] font-medium text-h26-green underline-offset-2 hover:underline"
              onClick={() => (published ? onSeeResults() : setShowStatus(true))}
              type="button"
            >
              See full Election Status view ↑
            </button>
          </div>
        )}

        {topic === 'lose' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Your device keeps the Verification # in local browser storage for this election. Clearing site data can
              lose it — same idea as losing a paper receipt.
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                'Write it down or screenshot this confirmation page',
                'Email/SMS receipts (when enabled) can carry it',
                'Election admins never have your # — they can’t look it up for you',
              ].map((item) => (
                <li className="flex gap-2 text-[0.78rem] text-h26-textSecondary" key={item}>
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-h26-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
