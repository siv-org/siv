import { useEffect, useState } from 'react'

export const ReturnToProvisional = () => {
  const [fadeIn, setFadeIn] = useState(false)

  // Fade in after short delay
  // to avoid FOUC when normal voters submit
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true)
    }, 500)
  }, [])

  return (
    <div className={`text-center ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <p className="mt-8 text-2xl">You already started a provisional ballot from this browser.</p>
      <p className="mt-2 text-lg">You can start a new one in an Incognito window.</p>
    </div>
  )
}
