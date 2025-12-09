import { useEffect, useState } from 'react'

const devUrl = 'http://127.0.0.1:3002'
const prodUrl = 'https://sms.siv.org'
const domain = process.env.NODE_ENV === 'production' ? prodUrl : devUrl
const url = domain + '/verify'

export const SMSNewTab = () => {
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
    <div className="mt-8 w-full">
      {!result ? (
        <a
          className="p-3 bg-blue-50 rounded-md border-2 border-blue-200 hover:bg-blue-100"
          href={url}
          rel="noreferrer"
          target="_blank"
        >
          Get Started
        </a>
      ) : (
        <div>Result: {JSON.stringify(result)}</div>
      )}
    </div>
  )
}
