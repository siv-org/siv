import { LabeledRow } from '../../shared/LabeledRow'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'

export function Strengthen({
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
      <LabeledRow className="mt-4" label="Current Verification #" mono value={original} />
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
          {preview && <LabeledRow className="mt-3" emphasize label="New Verification #" mono value={preview} />}
          <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:flex-wrap">
            <PrimaryButton disabled={!preview} onClick={onStrengthen}>
              Update number
            </PrimaryButton>
            <SecondaryButton onClick={onSkip}>Skip</SecondaryButton>
          </div>
        </>
      ) : (
        <>
          <LabeledRow className="mt-4" emphasize label="Updated Verification #" mono value={strengthened} />
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
