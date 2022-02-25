import { useEffect } from 'react'
import { api } from 'src/api-helper'

const isBrowser = () => typeof window !== 'undefined'

const startSession = (hash: string) => {
  api('load', { hash }).then(async (res) => {
    if (res.status === 200) {
      const id = await res.text()

      document.onvisibilitychange = async () => {
        if (id && document.visibilityState === 'hidden') navigator.sendBeacon(`/api/unload?i=${id}`)
        if (document.visibilityState === 'visible') startSession(hash)
      }
    }
  })
}

export const useAnalytics = () => {
  useEffect(() => {
    if (!isBrowser) return
    const hash = window.location.hash

    startSession(hash)
  }, [])
}
