import { useEffect } from 'react'
import { api } from 'src/api-helper'

const isBrowser = () => typeof window !== 'undefined'

export const useAnalytics = () => {
  useEffect(() => {
    if (!isBrowser) return
    const hash = window.location.hash

    api('load', { hash })
  }, [])
}
