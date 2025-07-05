import { useEffect, useRef } from 'react'

export const ElectionQR = ({ className, url }: { className?: string; url: string }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return // Client-side only

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return console.warn('Missing QR container ref')
      const qrCode = new QRCodeStyling({ data: url, height: 80, width: 80 })
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [])

  return (
    <div className="flex justify-center">
      <div {...{ className, ref }} />
    </div>
  )
}
