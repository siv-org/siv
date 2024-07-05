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
          <Loader /> Checking if Voter Auth Token is valid...
        </p>
      ) : status === 'fail' ? (
        <p className="!border-red-500">
          <span className="text-[10px] mr-2">❌</span> <b className="mr-1">Error:</b> {message}
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
        <p className="!border-green-700">✅ {message}</p>
      )}
      <style jsx>{`
        p {
          padding: 9px 8px;
          border-width: 1px;
          border-style: solid;
          border-color: #ccc;
          border-radius: 3px;
          height: 45px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  )
}

function Loader() {
  return (
    <span className="inline-block border-4 border-solid border-[#eee] border-t-[#aaa] rounded-full w-[17px] h-[17px] animate-spin mr-2" />
  )
}
