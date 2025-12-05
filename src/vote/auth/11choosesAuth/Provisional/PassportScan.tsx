import router from 'next/router'
import { useState } from 'react'
import { api } from 'src/api-helper'

export const PassportScan = ({ election_id, link_auth }: { election_id: string; link_auth: string }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="mt-6 text-center">
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

          await router.push(`https://passportreader.app/open?token=${data.token}&redirect_url=${window.location.href}`)

          setLoading(false)
        }}
      >
        {!loading ? 'Get Started' : <span className="animate-pulse text-black/50">Loading...</span>}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-2 text-sm opacity-50">You&apos;ll be redirected for further instructions</div>
    </div>
  )
}
