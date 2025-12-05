import { useEffect } from 'react'

export const useWarnOnClose = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [])
}
