import { OTHER_VOTERS } from '../../content'
import { UnlockedVote } from '../../demoState'
import { PrimaryButton } from '../../shared/PrimaryButton'

export function Audit({
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
          {boardVotes.length} encrypted submissions, each tied to a registered Voter Code. No anonymous stuffing.
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
