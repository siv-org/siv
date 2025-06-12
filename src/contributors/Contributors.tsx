import { ContributorRow } from './ContributorDesign'

export function Contributors() {
  return (
    <div className="max-w-4xl px-6 m-16 mx-auto">
      <div className="mb-16 text-center">
        {/* Page title */}
        <h1 className="mb-6 text-4xl font-medium tracking-tight text-gray-900">Contributors</h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Meet the people who've helped shape the mission of voter-verifiable elections:
        </p>
      </div>

      {/* Contributors Table */}
      <ContributorRow
        name="David Ernst"
        focus="System Architecture, Security, Cryptography & Organizational Strategy"
        affiliation="SIV.org Founder"
      />

      <ContributorRow name="Ariana Ivan" focus="Operations & Software Engineering" affiliation="SIV.org" />

      <ContributorRow name="Greg Little, PhD" focus="Cryptography Algorithms & Privacy" affiliation="MIT" />

      <ContributorRow
        name="Nathan Foss"
        focus="Vote Selling + Coercion Resistant Algorithms & Innovative Governance Applications"
        affiliation="MIT"
      />

      <ContributorRow
        name="Erica Contulov"
        focus="Statistics & Post-Election Audit"
        affiliation="Bucharest University of Economic Studies"
      />

      <ContributorRow name="John Cumbers" focus="Strategy" affiliation="Former NASA Scientist" />

      <ContributorRow name="Warren Ernst" focus="Legal & Government" affiliation="Former City Attorney of Dallas, TX" />

      <ContributorRow
        name="Alessandro ctrlc03"
        focus="Privacy, Vote Selling & Coercion Resistant Algorithms"
        affiliation="pse.dev & MACI"
      />

      <ContributorRow name="Gino Parisi" focus="Government & Policy" affiliation="Colorado State University" />

      <ContributorRow
        name="Chris Jackett, PhD"
        focus="Cybersecurity Review & Implementation"
        affiliation="Australia's National Science Agency, CSIRO"
      />

      <ContributorRow name="Joshua Herr" focus="Voting Methods & Engineering" affiliation="Colorado Forward Party" />

      <ContributorRow
        name="Jason Green, PhD Candidate"
        focus="US Elections Cybersecurity"
        affiliation="CREO Cybersecurity Lab, North Carolina A & T State University"
      />
    </div>
  )
}
