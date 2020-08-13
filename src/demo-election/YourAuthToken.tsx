import { useEffect, useState } from 'react'

import { api } from '../api-helper'

type Status = undefined | 'fail' | 'pass'

export const YourAuthToken = ({ authToken, electionId }: { authToken?: string; electionId?: string }) => {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>()

  async function validateAuthToken() {
    // Reset status
    setMessage('')
    setStatus(undefined)

    // Make sure we have the right parameters
    if (!authToken) {
      setStatus('fail')
      return setMessage('Missing Auth Token.')
    }

    if (!electionId) {
      setStatus('fail')
      return setMessage('Missing Election ID.')
    }

    // Ask API
    const response = await api('check-auth-token', { authToken, electionId })
    setStatus(response.status >= 400 ? 'fail' : 'pass')
    setMessage(await response.text())
  }

  // Check auth token w/ admin server
  useEffect(() => {
    validateAuthToken()
  }, [authToken, electionId])

  return (
    <>
      {!status ? (
        <p>
          <span className="loader" /> Checking if Voter Auth Token is valid...
        </p>
      ) : status === 'fail' ? (
        <p className="error">
          <span className="x">❌</span> <b>Error:</b>&nbsp;{message}
        </p>
      ) : (
        <p className="authorized">✅ {message}</p>
      )}
      <style jsx>{`
        p {
          padding: 9px 8px;
          border: 1px solid #ccc;
          border-radius: 3px;
          height: 45px;
          display: flex;
          align-items: center;
        }

        .error {
          border-color: red;
        }

        .x {
          font-size: 10px;
          margin-right: 8px;
        }

        .authorized {
          border-color: green;
        }

        .loader {
          display: inline-block;
          border: 4px solid #eee;
          border-top: 4px solid #aaa;
          border-radius: 50%;
          width: 17px;
          height: 17px;
          animation: spin 1.2s linear infinite;

          margin-right: 8px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
