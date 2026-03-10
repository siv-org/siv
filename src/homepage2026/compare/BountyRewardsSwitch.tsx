import { ToggleSwitch } from './ToggleSwitch'

type Props = {
  bountyEnabled: boolean
  toggleBounty: () => void
}

export function BountyRewardsSwitch({ bountyEnabled, toggleBounty }: Props) {
  return (
    <div className="mt-1.5 text-[0.78rem] font-normal text-h2026-textSecondary">
      <ToggleSwitch checked={bountyEnabled} label="Show bounty & overrides" onClick={toggleBounty} />
    </div>
  )
}
