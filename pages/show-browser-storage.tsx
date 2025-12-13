import { useEffect } from 'react'
import { useState } from 'react'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a className="text-blue-500 hover:underline" href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  )
}

function ShowBrowserStoragePage() {
  const [storage, setStorage] = useState<Record<string, string>>({})
  const [error, setError] = useState<string>('')

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

  const voterKeys = Object.keys(storage).filter((key) => key.startsWith('voter-'))

  return (
    <main className="flex flex-col p-4 py-12 mx-auto w-full max-w-xl min-h-screen">
      <Head title="Show Browser Storage" />
      <h1 className="text-3xl font-bold">Show Browser Storage</h1>

      <div className="mt-8">
        <p>This tool helps you see all the vote data stored in this device{"'"}s browser.</p>
        <p className="text-sm opacity-50">This information is local only, and not shared with anyone.</p>
      </div>

      <details className="p-2 pt-0 mt-4 -ml-2 rounded-lg open:bg-gray-100 group">
        <summary className="p-2 -ml-2 font-medium rounded-lg cursor-pointer hover:bg-gray-200 w-fit group-open:w-full">
          Reminder: Your vote is your private choice 🛡️
        </summary>
        <div className="space-y-1 text-sm opacity-50">
          <p>For elections to be truly Free and Fair, every voter must be able to make their own honest choices.</p>
          <p>
            If anyone is pressuring you to vote or prove you voted a certain way, SIV has{' '}
            <Link href="/overrides">advanced tools</Link> available to help.
          </p>
          <p>
            Please contact your election administrator or <Link href="mailto:help@siv.org">help@siv.org</Link>.
          </p>
        </div>
      </details>

      {error && <p className="text-red-500">{error}</p>}

      {voterKeys.length > 0 ? (
        <>
          <h2 className="mt-8 text-2xl font-bold">Voter:</h2>
          <ul>
            {voterKeys.map((key, index) => {
              const rowData = JSON.parse(storage[key])

              const auth_token = key.split('-')[2] || 'unknown'

              return (
                <li className="mt-4" key={key}>
                  <div>
                    {index + 1}. {key}
                  </div>
                  <div className="mt-0.5">
                    <b className="font-semibold">Election Title:</b> {rowData.election_title}
                  </div>
                  <div>
                    <b className="font-semibold">Auth Token:</b> {auth_token}
                  </div>
                  <div>
                    <b>Vote Submitted at:</b> {rowData.submitted_at || 'Not submitted'}
                  </div>
                  {
                    <div>
                      <b>Verification #:</b> {rowData.tracking}
                    </div>
                  }
                </li>
              )
            })}
          </ul>
        </>
      ) : (
        <p className="mt-10 text-xl font-bold opacity-50">No votes found</p>
      )}

      <details className="mt-8">
        <summary className="p-2 -ml-2 text-lg font-medium rounded-lg cursor-pointer hover:bg-gray-200 w-fit">
          Show Raw data:
        </summary>
        <pre className="p-4 whitespace-pre-wrap break-all rounded-md bg-gray-00">
          {JSON.stringify(storage, null, 2)}
        </pre>
      </details>

      <TailwindPreflight />
    </main>
  )
}

export default ShowBrowserStoragePage
