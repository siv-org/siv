import { useStored } from '../useStored'

/** Shown only when unlockable ciphertext has changed since last unlock — actionable for re-unlock timing. */
export const StrengthenedCounts = () => {
  const { last_decrypted_at, num_strengthened_since_unlock = 0 } = useStored()

  if (!last_decrypted_at || num_strengthened_since_unlock < 1) return null

  const suggestWait = num_strengthened_since_unlock < 5

  return (
    <div className="mr-4 mb-3.5 rounded-md border border-solid border-black/15 bg-black/[0.03] p-2.5">
      <p className="m-0 text-[13px]">
        <span className="font-medium text-black/70">
          {num_strengthened_since_unlock} vote{num_strengthened_since_unlock === 1 ? '' : 's'} strengthened
        </span>
        <span className="text-black/55"> since last unlock</span>
      </p>
      {suggestWait && (
        <p className="m-0 mt-1 text-[12px] text-black/45">
          Wait for a few strengthens before re-unlocking so a single change isn&apos;t identifying.
        </p>
      )}
    </div>
  )
}
