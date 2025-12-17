import { useEffect } from 'react'
import { useState } from 'react'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { AntiCoercionReminder } from 'src/vote/submitted/AntiCoercionReminder'
import TimeAgo from 'timeago-react'

function BrowserStoragePage() {
  const [storage, setStorage] = useState<Record<string, string>>({})
  const [error, setError] = useState<string>('')

  // Load localStorage
  useEffect(() => {
    let storageResults
    try {
      storageResults = localStorage
    } catch (error) {
      setError(`Error loading storage: ${error}`)
    }
    if (!storageResults) return setError('No storage found')

    console.log(storageResults)

    setStorage(storageResults)
  }, [])

  // Filter voter keys
  const voterKeys = Object.keys(storage).filter((key) => key.startsWith('voter-'))

  return (
    <main className="flex flex-col p-4 py-12 mx-auto w-full max-w-xl min-h-screen">
      <Head title="View Browser Storage" />

      {/* Page title */}
      <h1 className="text-3xl font-bold">View Browser Storage</h1>

      {/* Description */}
      <div className="mt-8">
        <p>This tool helps you see all the vote data stored in this device{"'"}s browser.</p>
        <p className="text-sm opacity-50">This information is local only, and not shared with anyone.</p>
      </div>

      {/* Anti-Coercion Reminder */}
      <AntiCoercionReminder />

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Voter Data */}
      {!voterKeys.length ? (
        <>
          {/* None found */}
          <p className="mt-10 text-xl italic opacity-50">No vote data found.</p>
          <p className="text-sm opacity-30">Cleared by Incognito windows</p>
        </>
      ) : (
        <>
          {/* Vote Data */}
          <h2 className="mt-8 text-2xl font-bold">Vote Data:</h2>
          <ul>
            {voterKeys.map((key, index) => {
              const rowData = JSON.parse(storage[key])
              // console.log(rowData)

              const auth_token = key.split('-')[2] || 'unknown'

              return (
                <li className="p-4 mt-6 rounded-lg bg-blue-50/80" key={key}>
                  <div>
                    {index + 1}. {key}
                  </div>

                  <div className="mt-0.5">
                    <SB>Election Title:</SB> {rowData.election_title}
                  </div>
                  <div>
                    <SB>Auth Token:</SB> {auth_token}
                  </div>

                  <div className="mt-1.5 text-sm opacity-50">
                    <SB>Last modified:</SB>{' '}
                    <TimeAgo datetime={new Date(rowData.last_modified_at)} title={rowData.last_modified_at} />
                  </div>
                  <div>
                    <SB>Vote Submitted:</SB> {rowData.submitted_at || <i className="opacity-50">Not submitted</i>}
                  </div>

                  <div className="mt-1.5">
                    <SB>Verification #:</SB> {rowData.tracking}
                  </div>
                  <div className="text-sm opacity-50">
                    <SB># selections:</SB>{' '}
                    {
                      Object.entries((rowData.plaintext as Record<string, string>) || {}).filter(
                        ([, value]) => !value.endsWith('BLANK'),
                      ).length
                    }
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {/* Raw Data */}
      <details className="mt-8">
        <summary className="p-2 -ml-2 font-medium rounded-lg cursor-pointer hover:bg-gray-200 w-fit">
          Show raw data:
        </summary>
        <pre className="p-4 whitespace-pre-wrap break-all rounded-md bg-gray-00">
          {JSON.stringify(storage, null, 2)}
        </pre>
      </details>

      <TailwindPreflight />
    </main>
  )
}

function SB({ children }: { children: React.ReactNode }) {
  return <b className="font-semibold">{children}</b>
}

export default BrowserStoragePage
