// Deprecated in favor of SMSNewTab.
// Google's recaptcha really doesn't like
// being embedded in another iframe.

import { useEffect, useState } from 'react'

const devUrl = 'http://127.0.0.1:3002'
const prodUrl = 'https://sms.siv.org'
const domain = process.env.NODE_ENV === 'production' ? prodUrl : devUrl
const url = domain + '/embed'

export const SMSiFrame = () => {
  const [result, setResult] = useState<null | { confirmed_sms: string; firebase_uid: string; session_id: string }>(null)

  // Listen for messages from the iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'IFRAME_MESSAGE') {
        console.log('FROM IFRAME:', event.data.payload)
        setResult(event.data.payload)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div className="w-full h-[550px]">
      {!result ? <iframe className="w-full h-full" src={url}></iframe> : <div>Result: {JSON.stringify(result)}</div>}
    </div>
  )
}
