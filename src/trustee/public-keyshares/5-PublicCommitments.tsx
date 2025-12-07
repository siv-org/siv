import { State } from '../trustee-state'

export const PublicCommitments = ({ state }: { state: State }) => {
  const { trustees } = state

  return (
    <details className="w-full">
      <summary className="p-2 -ml-2 w-full rounded-lg cursor-pointer hover:bg-gray-100">
        <p className="text-sm text-gray-500">From DKG Transcript:</p>
        <h3 className="text-xl font-bold">V. Public Commitments</h3>
      </summary>
      <p className="mt-2 mb-4 text-sm text-gray-500">
        Each party broadcasts public commitments A<sub>0</sub>, ..., A<sub>t-1</sub> based on their private
        coefficients, A<sub>c</sub> = G * a<sub>c</sub>.
      </p>

      {!trustees?.length ? (
        <p className="text-pink-500">No trustees found.</p>
      ) : (
        <ol className="space-y-6">
          {trustees.map(({ commitments, email }) => (
            <li key={email}>
              {commitments ? (
                <>
                  <b className="font-semibold">{email}</b> broadcast commitments
                  <ul className="pl-5 space-y-2 text-sm list-decimal break-words marker:text-sm">
                    {commitments.map((commitment) => (
                      <li key={commitment}>{commitment}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <i>
                  Waiting on <b>{email}</b> to broadcast their commitments...
                </i>
              )}
            </li>
          ))}
        </ol>
      )}
    </details>
  )
}
