import { useEffect } from 'react'
import { api } from 'src/api-helper'

const isBrowser = () => typeof window !== 'undefined'

export const useAnalytics = () => {
  useEffect(() => {
    if (!isBrowser) return
    const hash = window.location.hash

    api('load', { hash }).then(async (res) => {
      if (res.status === 200) {
        const id = await res.text()

        window.onbeforeunload = async () => {
          if (id) navigator.sendBeacon(`/api/unload?i=${id}`)
        }
      }
    })
  }, [])
}
