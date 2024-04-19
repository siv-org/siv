import Link from 'next/link'

import { Spinner } from '../admin/Spinner'
import { useConventionRedirect } from './useConventionRedirect'

export const ConventionQRPage = () => {
  const { convention_id, errorMessage, loading, publicConventionInfo, voter_id } = useConventionRedirect()

  const { active_redirect, convention_title } = publicConventionInfo || {}

  return (
    <div className="flex flex-col justify-between min-h-screen p-4 pt-6 font-sans bg-gradient-to-b from-gray-200 to-gray-500/80">
      {/* Headerbar */}
      <header className="font-semibold text-center">Secure Internet Voting</header>

      {/* Middle section */}
      <main>
        {/* Header line */}
        <div className="text-2xl -mt-28 opacity-90">
          {errorMessage ? (
            <>Error: {errorMessage}</>
          ) : loading ? (
            <>
              <Spinner />
              <span className="ml-2">Looking up redirect info...</span>
            </>
          ) : (
            <>Unknown error</>
          )}
        </div>
        {/* Details */}
        <div className="mt-10 opacity-70">
          <div>Convention ID: {convention_id}</div>
          {convention_title && <div className="mb-3">Title: {convention_title}</div>}
          <div className="mb-3">QR ID: {voter_id}</div>

          {active_redirect && (
            <div>
              Active Redirect: <Link href={`/election/${active_redirect}/vote`}>{active_redirect}</Link>
            </div>
          )}
        </div>
      </main>

      {/* Bottom spacer */}
      <footer />
    </div>
  )
}
