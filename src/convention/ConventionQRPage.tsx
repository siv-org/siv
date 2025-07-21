import { Spinner } from '../admin/Spinner'
import { useConventionRedirect } from './useConventionRedirect'

export const ConventionQRPage = () => {
  const { convention_id, conventionRedirectInfo, errorMessage, loading, qr_id } = useConventionRedirect()

  const { active_ballot_auth, active_redirect, convention_title } = conventionRedirectInfo || {}

  if (!convention_id) return null

  return (
    <div className="flex flex-col justify-between p-4 pt-6 mx-auto max-w-lg min-h-screen font-sans">
      {/* Headerbar */}
      <header className="font-semibold text-center">Secure Internet Voting</header>

      {/* Middle section */}
      {convention_id && (
        <main>
          {!errorMessage ? (
            // Loading or happy path
            <div className="-mt-24 text-2xl text-center opacity-90">
              {!loading && !active_redirect ? (
                <>
                  <div className="text-lg">{convention_title}</div>
                  No active election yet.
                </>
              ) : (
                <div className="-ml-10">
                  <Spinner />
                  <span className="ml-2">Loading your ballot...</span>
                </div>
              )}
            </div>
          ) : (
            // Error
            <>
              <div className="-mt-28 text-2xl opacity-90">Error: {errorMessage}</div>
              {/* Debug info */}
              <div className="mt-10 opacity-70">
                <div className="text-sm opacity-70">Debug Info</div>
                <div>Convention ID: {convention_id}</div>
                <div>QR ID: {qr_id}</div>

                <div className="mt-3 text-sm opacity-70">Loaded:</div>
                <div>Convention Title: {convention_title}</div>
                <div>Active ballot: {active_redirect}</div>
                <div>Ballot auth: {active_ballot_auth}</div>
              </div>
            </>
          )}
        </main>
      )}

      {/* Bottom spacer */}
      <footer />
    </div>
  )
}
