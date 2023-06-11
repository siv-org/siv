import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

export const InvalidatedVoteMessage = () => {
  const [message, setMessage] = useState('')
  const [wasVoteInvalidated, setWasVoteInvalidated] = useState(null)
  const router = useRouter()
  const { auth, election_id } = router.query

  useEffect(() => {
    api(`/election/${election_id}/was-vote-invalidated?auth=${auth}`)
      .then((response) => response.json())
      .then((data) => setWasVoteInvalidated(data))
  }, [])
  if (!wasVoteInvalidated) return null
  return (
    <div className="p-3 mb-5 bg-red-100 rounded">
      <h3 className="m-0">Your Submitted Vote was invalidated.</h3>
      <p>If you believe this was in error, you can write a message to the Election Administrator:</p>
      <hr />
      <textarea
        className="w-full h-16 p-1"
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button>Submit</button>
    </div>
  )
}
