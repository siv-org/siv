import useSWR from 'swr'

export const ProvisionalAuthComplete = ({ election_id, link_auth }: { election_id: string; link_auth: string }) => {
  const { isAuthComplete } = useAuthComplete(election_id, link_auth)

  //   console.log('isAuthComplete', isAuthComplete)
  if (!isAuthComplete) return null

  return (
    <div className="p-4 mb-8 text-center bg-green-50 rounded-lg border">
      <h1 className="text-2xl font-semibold tracking-tight text-center text-slate-900">
        <span>
          ✅ &nbsp;Your auth is now complete.
          <br />
        </span>
        <div className="mt-4 text-3xl">Thank you.</div>
      </h1>
    </div>
  )
}

function useAuthComplete(election_id: string, link_auth: string) {
  const { data, error } = useSWR(
    election_id &&
      link_auth &&
      `/api/11-chooses/provisional/is-auth-complete?election_id=${election_id}&link_auth=${link_auth}`,
    fetcher,
  )
  if (error) console.error('isAuthComplete error', error)
  if (!data) return { isAuthComplete: false }

  return { isAuthComplete: data.is_auth_complete }
}
const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    if (!r.ok) throw await r.json()
    return await r.json()
  })
