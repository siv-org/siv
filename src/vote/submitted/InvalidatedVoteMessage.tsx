import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

export const InvalidatedVoteMessage = () => {
  const [message, setMessage] = useState('')
  const [wasVoteInvalidated, setWasVoteInvalidated] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
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
        disabled={isSubmitSuccessful}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
        value={message}
      />
      <br />
      <button
        disabled={isSubmitting || isSubmitSuccessful}
        onClick={async () => {
          setIsSubmitting(true)
          const response = await api(`/election/${election_id}/submit-invalidation-response`, { auth, message })

          if (!response.ok) return alert(`Error sending (status ${response.status})`)

          setIsSubmitting(false)
          setIsSubmitSuccessful(true)
        }}
      >
        {isSubmitSuccessful ? 'Submitted successfully' : 'Submit'}
      </button>
    </div>
  )
}
