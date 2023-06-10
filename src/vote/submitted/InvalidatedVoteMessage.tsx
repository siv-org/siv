import React, { useState } from 'react'

export const InvalidatedVoteMessage = () => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    // Here you should replace the alert with a request to your backend endpoint
    alert(`Message: ${message}`)
  }

  return (
    <div>
      <h3>Your Submitted Vote was invalidated.</h3>
      <p>If you believe this was in error, you can write a message to the Election Administrator:</p>
      <hr />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here..." />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
