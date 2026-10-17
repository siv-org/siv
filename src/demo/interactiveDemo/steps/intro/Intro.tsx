import { PrimaryButton } from '../../shared/PrimaryButton'

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <p className="text-[0.95rem] font-medium leading-relaxed text-h26-text">
        Built for the highest-stakes elections.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Most voters experience a simple process: get an invite, vote, and submit. Once results are published, they can
        check the outcome, and verify their own vote was correctly tallied.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Behind that simplicity are safeguards against malware secretly changing votes, coercion or vote selling, and
        results that can be independently audited.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        We design for the strongest adversaries, without requiring trust in technology providers, election officials, or
        SIV itself.
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
