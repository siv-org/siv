import { BadgeCheck, LockKeyhole, UserCheck } from 'lucide-react'

import { PrimaryButton } from '../../shared/PrimaryButton'

const PILLARS = [
  { icon: UserCheck, label: 'One Person, One Vote' },
  { icon: LockKeyhole, label: 'Private Voting' },
  { icon: BadgeCheck, label: 'Verifiable Results' },
]

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <section aria-labelledby="election-pillars">
        <p
          className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted"
          id="election-pillars"
        >
          Pillars of a secure election
        </p>
        <ol className="mt-3 grid grid-cols-3 divide-x divide-black/[0.07] overflow-hidden rounded-xl border border-black/[0.07] bg-h26-bg">
          {PILLARS.map(({ icon: Icon, label }) => (
            <li className="px-3 py-3.5 sm:px-4" key={label}>
              <span className="flex items-center gap-2 text-[0.75rem] font-medium leading-snug text-h26-text sm:text-[0.85rem]">
                <Icon aria-hidden className="size-4 shrink-0 text-h26-green sm:size-[1.125rem]" strokeWidth={1.75} />
                <span>{label}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <p className="mt-6 text-[0.95rem] font-medium leading-relaxed text-h26-text">
        Built for the highest-stakes elections.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Most voters experience a simple process: get an invite, vote, and submit. Once results are published, they can
        check the outcome, and verify their own vote was correctly tallied.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Behind that simplicity are strong safeguards: protection against malware secretly changing votes, defenses
        against coercion and vote selling, and results that can be independently audit.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        The SIV Protocol is designed to withstand the strongest adversaries, without requiring anyone to trust the
        technology providers (including us), election officials, or the servers running the vote.
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
