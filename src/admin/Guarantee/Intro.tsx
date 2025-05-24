import React from 'react'
import { Button } from 'src/_shared/Button'

export const FinancialGuaranteeIntro = () => (
  <div className="max-w-3xl mt-4 space-y-6">
    <h2 className="text-2xl font-bold">Guarantee Trust in Your Election</h2>

    {/* Blue Badge */}
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-blue-700 border border-blue-200 border-solid rounded bg-blue-50/70">
      <span className="text-xl">💡</span>
      <span>
        <strong>Optional but powerful:</strong> Elections with a guarantee report higher voter confidence.
      </span>
    </div>

    {/* Intro section */}
    <div className="space-y-2 text-lg text-gray-700">
      <p>When voters cast their ballots, they hope their votes will be counted.</p>

      <p>
        A <i>Vote Integrity Guarantee</i> gives you a way to <strong>back that trust with real assurance</strong>.
      </p>

      <p>
        Funding a guarantee shows voters your election takes integrity seriously: If any accepted votes are missing from
        the final tally, voters can claim a financial reward—backed by you, the election admin.
      </p>
    </div>

    {/* Why offer a guarantee? */}
    <h2 className="mt-6 text-xl font-semibold">Why offer a guarantee?</h2>
    <ul className="pl-1 space-y-4 text-gray-700 list-disc list-inside">
      <li>
        <strong>Build Voter Confidence</strong>
        <br />
        Voters are more likely to participate when they know the system is accountable and secure.
      </li>
      <li>
        <strong>Demonstrate Integrity</strong>
        <br />A financial guarantee is your public promise: votes will be counted—or voters will be compensated.
      </li>
      <li>
        <strong>Detect Issues Early</strong>
        <br />
        The guarantee incentivizes voters to check that their vote was included. This surfaces problems faster and
        increases transparency.
      </li>
      <li>
        <strong>Flexible and Optional</strong>
        <br />
        You choose how much to guarantee. Start small, scale as needed.
      </li>
    </ul>

    <p>
      <Button
        href="https://docs.siv.org/research-in-progress/financially-guaranteeing-vote-integrity"
        style={{ marginLeft: 0, padding: '0.5rem 1.5rem' }}
        target="_blank"
      >
        View full details of how the guarantee works
      </Button>
    </p>

    <div className="pt-4 text-lg text-gray-800">
      Ready to fund your guarantee? <strong>Add escrow funds below.</strong>
    </div>
  </div>
)
