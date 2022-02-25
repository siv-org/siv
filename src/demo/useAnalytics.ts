import { useEffect } from 'react'
import { api } from 'src/api-helper'

const isBrowser = () => typeof window !== 'undefined'

const startSession = () => {
  api('load', {
    hash: window.location.hash,
    height: window.innerHeight,
    width: window.innerWidth,
  }).then(async (res) => {
    if (res.status === 200) {
      const id = await res.text()

      document.onvisibilitychange = () => {
        if (id && document.visibilityState === 'hidden') navigator.sendBeacon(`/api/unload?i=${id}`)
        if (document.visibilityState === 'visible') startSession()
      }
    }
  })
}

export const useAnalytics = () => {
  useEffect(() => {
    if (!isBrowser) return

    startSession()
  }, [])
}
