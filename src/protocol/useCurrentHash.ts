import { useEffect, useState } from 'react'

import { stepHash } from './step-hash'
import { initStep } from './steps'

export const useCurrentHash = () => {
  const [current, setCurrent] = useState(stepHash[initStep])

  const setCurrentHash = () => {
    setCurrent(window.location.hash.slice(1))
  }

  useEffect(() => {
    setCurrentHash()
    const $Protocol = document.getElementById('protocol') as HTMLElement
    $Protocol.onscroll = setCurrentHash
  }, [])

  return current
}
