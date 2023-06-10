import React, { useState } from 'react'

export const InvalidatedVoteMessage = () => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    // Here you should replace the alert with a request to your backend endpoint
    alert(`Message: ${message}`)
  }

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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
