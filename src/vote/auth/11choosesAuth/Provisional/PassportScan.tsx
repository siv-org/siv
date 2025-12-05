import router from 'next/router'
import { useState } from 'react'
import { api } from 'src/api-helper'

export const PassportScan = () => {
  const [loading, setLoading] = useState(false)

  return (
    <div className="mt-6 text-center">
      <div
        className="inline-block p-4 bg-purple-50 rounded-lg border-2 border-purple-600 cursor-pointer hover:bg-purple-100"
        onClick={async () => {
          setLoading(true)
          const response = await api('11-chooses/provisional/create-passport-url')
          const data = await response.json()
          setLoading(false)

          router.push(`https://passportreader.app/open?token=${data.token}&redirect_url=${window.location.href}`)
        }}
      >
        {!loading ? 'Get Started' : <span className="animate-pulse text-black/50">Loading...</span>}
      </div>

      <div className="mt-2 text-sm opacity-50">You&apos;ll be redirected for further instructions</div>
    </div>
  )
}
