import { useEffect, useState } from 'react'

export const ReturnToProvisional = ({ election_id }: { election_id: string }) => {
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

      <div className="mt-16">
        <div>Or go to:</div>
        <a
          className="text-lg font-semibold text-blue-700 hover:underline"
          href={`/election/${election_id}/vote?auth=link&show=verification`}
        >
          Your Existing Ballot{"'"}s Verification Info
        </a>
      </div>
    </div>
  )
}
