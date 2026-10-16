import { PrimaryButton } from '../../shared/PrimaryButton'

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <p className="text-[0.95rem] leading-relaxed text-h26-textSecondary">
        Most voters only ever see the happy path: get an invite → vote → submit → check results and find your own vote
        in the list.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        But SIV also has defenses for when things go wrong: malware changing your vote, someone pressuring or buying
        your vote, or a result that needs end-to-end auditing.
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-h26-textSecondary">
        We design for the worst case: nation-states willing to spend military-sized budgets to sway high-stakes
        elections. And we neither ask for nor assume trust in anyone: party insiders, election officials, software and
        hardware vendors, voters, AI agents, or the SIV team itself.
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
