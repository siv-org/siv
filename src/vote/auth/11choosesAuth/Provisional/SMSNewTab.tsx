import { useEffect, useState } from 'react'

import { CallerIDCheck } from './SMS/CallerIDCheck'

const devUrl = 'http://127.0.0.1:3002'
const prodUrl = 'https://sms.siv.org'
const domain = process.env.NODE_ENV === 'production' ? prodUrl : devUrl

export const SMSNewTab = ({ election_id, link_auth }: { election_id: string; link_auth: string }) => {
  const [result, setResult] = useState<null | { confirmed_sms: string; firebase_uid: string; session_id: string }>(null)
  const url = domain + '/verify' + '?e=' + election_id + '&l=' + link_auth

  // Listen for messages from the iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'WINDOW_OPENER_MESSAGE') {
        console.log('FROM CHILD:', event.data.payload)
        setResult(event.data.payload)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div className="mt-8 w-full">
      {!result ? (
        <button
          className="p-3 py-2 bg-blue-50 rounded-md border-2 border-blue-200 hover:bg-blue-100"
          onClick={() => window.open(url, '_blank')}
          rel="noreferrer"
        >
          Get Started
        </button>
      ) : (
        <>
          <div>✅ Successfully verified ownership of your phone number</div>
          <CallerIDCheck />
        </>
      )}
    </div>
  )
}
