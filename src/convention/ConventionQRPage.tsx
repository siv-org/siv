import { Spinner } from '../admin/Spinner'
import { useConventionRedirect } from './useConventionRedirect'

export const ConventionQRPage = () => {
  const { convention_id, errorMessage, loading, publicConventionInfo, voter_id } = useConventionRedirect()

  const { active_redirect, convention_title } = publicConventionInfo || {}

  return (
    <main className="flex flex-col justify-between min-h-screen p-4 pt-6 font-sans bg-gradient-to-b from-gray-200 to-gray-500/80">
      {/* Headerbar */}
      <div className="font-semibold text-center">Secure Internet Voting</div>

      {/* Middle section */}
      <div>
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
        <div className="mt-10 opacity-70">
          <div>Convention ID: {convention_id}</div>
          <div>Voter ID: {voter_id}</div>

          {convention_title && <div className="mt-3">Convention: {convention_title}</div>}
        </div>
      </div>

      {/* Bottom spacer */}
      <div />
    </main>
  )
}
