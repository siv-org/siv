import { UnlockedVote } from '../../demoState'
import { formatMayor } from '../../shared/formatChoice'
import { PrimaryButton } from '../../shared/PrimaryButton'

export function Unlock({ onContinue, unlocked }: { onContinue: () => void; unlocked: UnlockedVote[] }) {
  return (
    <div>
      <ol className="mb-5 space-y-2 text-[0.85rem] text-h26-textSecondary">
        <li>✓ Voter Codes stripped</li>
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
