import { LockKeyhole, UserCheck, Vote } from 'lucide-react'

import { PrimaryButton } from '../../shared/PrimaryButton'

const PILLARS = [
  { icon: UserCheck, label: 'One Person, One Vote' },
  { icon: LockKeyhole, label: 'Private Voting' },
  { icon: Vote, label: 'Verifiable Results' },
]

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <section aria-labelledby="election-pillars">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted" id="election-pillars">
          Pillars of a secure election
        </p>
        <ol className="mt-5 grid grid-cols-3 divide-x divide-[#20392e]/10">
          {PILLARS.map(({ icon: Icon, label }) => (
            <li
              className="flex flex-col gap-3 px-3 py-1 first:pl-0 last:pr-0 sm:flex-row sm:items-center sm:px-5"
              key={label}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#f0f3eb]">
                <Icon aria-hidden className="size-[1.125rem] text-h26-green" strokeWidth={1.5} />
              </span>
              <span className="text-[0.75rem] font-medium leading-snug text-h26-text sm:text-[0.85rem]">
                {label}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-6 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Most voters experience a simple process: get an invite and submit a vote. Once results are published, they can
        check the outcome and verify that their own vote was correctly tallied.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Beneath that simplicity are strong safeguards. The SIV Protocol is designed to withstand the strongest
        adversaries, without requiring anyone to trust technology providers, election officials, or the servers running
        the vote.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Those safeguards extend to even more advanced threats: fake voters, malware secretly changing votes, coercion,
        and vote selling. Explore the demo to see how these protections work.
      </p>
      {/* <ul className="mt-5 space-y-2 text-[0.9rem] text-h26-textSecondary">
        <li>· This is a simulated sandbox — no real election / no login</li>

        <li>· Click items on the left to jump to a defense</li>
      </ul> */}
      <div className="flex justify-end mt-8">
        <PrimaryButton className="!w-auto" onClick={onStart}>
          Start as a voter
        </PrimaryButton>
      </div>
    </div>
  )
}
