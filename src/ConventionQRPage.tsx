import { useRouter } from 'next/router'

import { Spinner } from './admin/Spinner'

export const ConventionQRPage = () => {
  const { convention_id, voter_id } = useRouter().query
  return (
    <main className="flex flex-col justify-between min-h-screen p-4 pt-6 font-sans bg-gradient-to-b from-gray-200 to-gray-500/80">
      {/* Headerbar */}
      <div className="font-semibold text-center">Secure Internet Voting</div>

      {/* Middle section */}
      <div>
        <div className="text-2xl -mt-28 opacity-90">
          <Spinner />
          <span className="ml-2">Looking up redirect info...</span>
        </div>
        <div className="mt-10 opacity-70">
          <div>Convention ID: {convention_id}</div>
          <div>Voter ID: {voter_id}</div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div />
    </main>
  )
}
