import router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

export const PassportScan = ({ election_id, link_auth }: { election_id: string; link_auth: string }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  usePassportResults()

  return (
    <div className="mt-6 text-center">
      {/* Get Started btn */}
      <div
        className="inline-block p-4 bg-purple-50 rounded-lg border-2 border-purple-600 cursor-pointer hover:bg-purple-100"
        onClick={async () => {
          setError('')
          setLoading(true)
          const response = await api('11-chooses/provisional/create-passport-url', { election_id, link_auth })
          const data = await response.json()
          if (!response.ok) {
            setLoading(false)
            console.error('create-passport-url response', data)
            return setError('Failed to create passport session')
          }

          const redirect_url = `${window.location.href}&passport=complete`

          await router.push(`https://passportreader.app/open?token=${data.token}&redirect_url=${redirect_url}`)

          setLoading(false)
        }}
      >
        {!loading ? 'Get Started' : <span className="animate-pulse text-black/50">Loading...</span>}
      </div>

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Instruction line */}
      <div className="mt-2 text-sm opacity-50">You&apos;ll be redirected for further instructions</div>
    </div>
  )
}

function usePassportResults() {
  const router = useRouter()
  const { election_id, link_auth, passport } = router.query
  const returnedFromPassport = passport === 'complete'

  const [loadingResults, setLoadingResults] = useState(false)

  async function getSessionResults() {
    setLoadingResults(true)
    const response = await api('11-chooses/provisional/get-passport-results', { election_id, link_auth })
    const json = await response.json()
    setLoadingResults(false)

    // Redirect to Submitted when passed
    if (json.passed) router.replace('/success')
  }

  useEffect(() => {
    if (!returnedFromPassport) return
    getSessionResults()
  }, [returnedFromPassport])

  return { loadingResults }
}
