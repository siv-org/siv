import { useRouter } from 'next/router'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import useSWR from 'swr'

import { PublicCommitments } from './5-PublicCommitments'

export function PublicKeysharesPage() {
  const router = useRouter()
  console.log({ router })
  const { election_id } = useRouter().query as { election_id?: string }
  console.log({ election_id })

  const { data, isLoading } = useSWR(election_id ? `/api/election/${election_id}/trustees/latest` : null, (url) =>
    fetch(url).then((res) => res.json()),
  )

  return (
    <main className="flex flex-col p-4 py-12 mx-auto w-full max-w-xl min-h-screen text-center">
      <Head title="Public Key Shares" />
      <h1 className="text-3xl font-bold">Public Key Shares</h1>

      <div className="flex flex-col justify-center items-center mt-8">
        {!data ? (
          isLoading ? (
            'Loading public keygen transcript...'
          ) : (
            'No public key shares found.'
          )
        ) : (
          <details className="marker:text-lg">
            <summary className="text-sm text-gray-500 cursor-pointer">How these are derived</summary>
            <div className="text-left">
              <PublicCommitments state={data} />
            </div>
          </details>
        )}
      </div>

      <TailwindPreflight />
    </main>
  )
}
