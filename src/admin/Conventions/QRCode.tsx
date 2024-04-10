import type { Options } from 'qr-code-styling'
import { useEffect, useRef } from 'react'

const qrOptions: Options = {
  cornersSquareOptions: { color: '#000000', type: 'square' },
  data: 'https://siv.org/c/2024/:conv_id/:voter_id',
  dotsOptions: {
    gradient: {
      colorStops: [
        { color: '#010b26', offset: 0 },
        { color: '#072054', offset: 1 },
      ],
      type: 'radial',
    },
    type: 'classy-rounded',
  },
  height: 111,
  //   image: '10cc19bd484118dbcd0a7886a38ceddc.png',
  imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
  qrOptions: { errorCorrectionLevel: 'H' },
  width: 111,
}

export const QRCode = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return // Client-side only

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return console.warn('Missing QR container ref')
      const qrCode = new QRCodeStyling(qrOptions)
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [])

  return (
    <div>
      <div ref={ref} />
    </div>
  )
}
