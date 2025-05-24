import React from 'react'

export const FinancialGuaranteeIntro = () => (
  <div className="max-w-3xl space-y-6">
    <h1 className="text-3xl font-bold">Guarantee Trust in Your Election</h1>

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
        The Financial Integrity Guarantee gives you a way to <strong>back that trust with real assurance</strong>.
      </p>

      <p>
        Funding a guarantee shows voters your election takes integrity seriously: If any accepted votes are missing from
        the final tally, voters can claim a financial reward—backed by you, the election admin.
      </p>
    </div>

    {/* Why offer a guarantee? */}
    <h2 className="mt-6 text-xl font-semibold">Why offer a guarantee?</h2>
    <ul className="pl-1 space-y-2 text-gray-700 list-disc list-inside">
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
  </div>
)
