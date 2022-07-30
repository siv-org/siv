import router from 'next/router'
import { useEffect } from 'react'

export const useRedirect = (to: string) => {
  useEffect(() => {
    if (router.pathname !== to) router.replace(to)
  }, [])
}
