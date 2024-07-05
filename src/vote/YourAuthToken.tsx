import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import { api } from '../api-helper'

type Status = undefined | 'fail' | 'pass' | 'preview' | 'link'

export const YourAuthToken = ({ auth, election_id }: { auth?: string; election_id?: string }) => {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>()

  async function validateAuthToken() {
    if (auth === 'preview') return setStatus('preview')
    if (auth === 'link') return setStatus('link')

    // Wait for election_id
    if (!election_id) return

    // Reset status
    setMessage('')
    setStatus(undefined)

    // Ask API
    const response = await api('check-auth-token', { auth, election_id })
    setStatus(response.status >= 400 ? 'fail' : 'pass')
    setMessage(await response.text())
  }

  // Check auth token w/ admin server
  useEffect(() => {
    validateAuthToken()
  }, [auth, election_id])

  return (
    <>
      {!status ? (
        <p>
          <span className="loader" /> Checking if Voter Auth Token is valid...
        </p>
      ) : status === 'fail' ? (
        <p className="error">
          <span className="x">❌</span> <b>Error:</b> {message}
        </p>
      ) : status === 'preview' ? (
        <p className="italic opacity-70">
          <span className="mr-2">🔍</span> Preview mode, skipping auth check
        </p>
      ) : status === 'link' ? (
        <p className="italic opacity-70">
          <UserOutlined className="text-[16px] mr-2 relative bottom-px" /> Authentication will come next
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

        .error b {
          margin-right: 5px;
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
