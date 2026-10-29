import { useEffect, useRef } from 'react'

export function InviteQRCode({
  auth,
  showLink = true,
  showVoteLogo = false,
  size = 128,
  voteLink,
}: {
  auth: string
  showLink?: boolean
  showVoteLogo?: boolean
  size?: number
  voteLink: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return
      const qrCode = new QRCodeStyling({
        cornersSquareOptions: { color: '#000000', type: 'square' },
        data: new URL(voteLink, window.location.origin).href,
        dotsOptions: { type: 'classy-rounded' },
        height: size,
        image: showVoteLogo ? '/VOTE.png' : undefined,
        imageOptions: { hideBackgroundDots: true, imageSize: 0.5, margin: 0 },
        qrOptions: { errorCorrectionLevel: showVoteLogo ? 'H' : 'M' },
        width: size,
      })
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [showVoteLogo, size, voteLink])

  return (
    <div className="flex max-w-[11rem] flex-col items-center gap-2">
      <a aria-label="Open demo ballot from QR code" href={voteLink}>
        <div
          aria-label="QR code containing your voting link"
          className="shrink-0"
          ref={ref}
          style={{ height: size, width: size }}
        />
      </a>
      {showLink && (
        <p className="whitespace-nowrap text-center font-mono26 text-[0.6rem] leading-snug text-h26-muted sm:text-[0.62rem]">
          local.gov/vote?auth=
          {auth}
        </p>
      )}
    </div>
  )
}
