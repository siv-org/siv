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
        affiliation="SIV.org Founder"
        focus="System Architecture, Security, Cryptography & Organizational Strategy"
        name="David Ernst"
      />

      <ContributorRow affiliation="SIV.org" focus="Operations & Software Engineering" name="Ariana Ivan" />

      <ContributorRow affiliation="MIT" focus="Cryptography Algorithms & Privacy" name="Greg Little, PhD" />

      <ContributorRow
        affiliation="MIT"
        focus="Vote Selling + Coercion Resistant Algorithms & Innovative Governance Applications"
        name="Nathan Foss"
      />

      <ContributorRow
        affiliation="Bucharest University of Economic Studies"
        focus="Statistics & Post-Election Audit"
        name="Erica Contulov"
      />

      <ContributorRow affiliation="Former NASA Scientist" focus="Strategy" name="John Cumbers" />

      <ContributorRow affiliation="Former City Attorney of Dallas, TX" focus="Legal & Government" name="Warren Ernst" />

      <ContributorRow
        affiliation="pse.dev & MACI"
        focus="Privacy, Vote Selling & Coercion Resistant Algorithms"
        name="Alessandro ctrlc03"
      />

      <ContributorRow affiliation="Colorado State University" focus="Government & Policy" name="Gino Parisi" />

      <ContributorRow
        affiliation="Australia's National Science Agency, CSIRO"
        focus="Cybersecurity Review & Implementation"
        name="Chris Jackett, PhD"
      />

      <ContributorRow affiliation="Colorado Forward Party" focus="Voting Methods & Engineering" name="Joshua Herr" />

      <ContributorRow
        affiliation="CREO Cybersecurity Lab, North Carolina A & T State University"
        focus="US Elections Cybersecurity"
        name="Jason Green, PhD Candidate"
      />
    </div>
  )
}
