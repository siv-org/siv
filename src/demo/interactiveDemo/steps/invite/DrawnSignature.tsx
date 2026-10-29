import { useEffect, useRef } from 'react'

export function DrawnSignature({ onClose }: { onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Only this demo iframe can request closing the preview.
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === 'siv-demo-signature-complete'
      )
        onClose()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onClose])

  return (
    <iframe
      className="block h-[480px] w-full border-0"
      ref={frame}
      src="/demo/signature"
      title="SIV signature screen"
    />
  )
}
