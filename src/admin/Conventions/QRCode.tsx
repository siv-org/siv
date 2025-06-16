import type { Options } from 'qr-code-styling'

import { useEffect, useRef } from 'react'

const qrOptions: Options = {
  cornersSquareOptions: { color: '#000000', type: 'square' },
  dotsOptions: { type: 'classy-rounded' },
  height: 111,
  image: '/VOTE.png',
  imageOptions: { hideBackgroundDots: true, imageSize: 0.5, margin: 0 },
  qrOptions: { errorCorrectionLevel: 'H' },
  width: 111,
}

export const QRCode = ({
  className,
  convention_id = ':conv_id',
  qr_id = ':qr_id',
}: {
  className?: string
  convention_id?: string
  qr_id?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return // Client-side only

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return console.warn('Missing QR container ref')
      const customData = `${window.location.origin}/c/${convention_id}/${qr_id}`
      const qrCode = new QRCodeStyling({ ...qrOptions, data: customData })
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [])

  return <div {...{ className, ref }} />
}
