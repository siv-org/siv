import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import { api } from '../api-helper'

type Status = '' | 'fail' | 'link' | 'pass' | 'preview'

export const YourAuthToken = ({ auth, election_id }: { auth?: string; election_id?: string }) => {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('')

  async function validateAuthToken() {
    if (auth === 'preview') return setStatus('preview')
    if (auth === 'link') return setStatus('link')

    // Wait for election_id
    if (!election_id) return

    // Reset status
    setMessage('')
    setStatus('')

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
      <p
        className={`px-2 border border-[#ccc] border-solid rounded h-[45px] flex items-center ${
          status === 'fail' && '!border-red-500'
        } ${status === 'pass' && '!border-green-700'} ${['link', 'preview'].includes(status) && 'italic opacity-70'}`}
      >
        {!status ? (
          <>
            <Loader /> Checking if Voter Auth Token is valid...
          </>
        ) : status === 'fail' ? (
          <>
            <span className="text-[10px] mr-2">❌</span> <b className="mr-1">Error:</b> {message}
          </>
        ) : status === 'pass' ? (
          `✅ ${message}`
        ) : status === 'preview' ? (
          <>
            <span className="mr-2">🔍</span> Preview mode, skipping auth check
          </>
        ) : status === 'link' ? (
          <>
            <UserOutlined className="text-[16px] mr-2 relative bottom-px" /> Auth check will come next
          </>
        ) : (
          'Unknown auth state'
        )}
      </p>
    </>
  )
}

function Loader() {
  return (
    <span className="inline-block border-4 border-solid border-[#eee] border-t-[#aaa] rounded-full w-[17px] h-[17px] animate-spin mr-2" />
  )
}
