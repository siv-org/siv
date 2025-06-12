import { ContributorRow } from './ContributorDesign'

export function Contributors() {
  return (
    <div className="max-w-4xl px-6 m-16 mx-auto">
      <div className="mb-16 text-center">
        {/* Page title */}
        <h1 className="mb-6 text-4xl font-medium tracking-tight text-gray-900">Contributors</h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Meet the people who've helped shape the Secure Internet Voting protocol:
        </p>
      </div>

      {/* Contributors Table */}
      <ContributorRow name="Dr. Sarah Chen" focus="Cryptography & Security" affiliation="Stanford University" />

      <ContributorRow name="Alex Rodriguez" focus="Distributed Systems" affiliation="MIT" />

      <ContributorRow name="Priya Patel" focus="Machine Learning" affiliation="Google Research" />

      <ContributorRow name="Marcus Johnson" focus="Blockchain Technology" affiliation="Ethereum Foundation" />
    </div>
  )
}
