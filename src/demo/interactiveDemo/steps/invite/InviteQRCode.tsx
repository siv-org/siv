import { useEffect, useRef } from 'react'

export function InviteQRCode({ auth }: { auth: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return
      const qrCode = new QRCodeStyling({
        cornersSquareOptions: { color: '#000000', type: 'square' },
        data: `https://www.local.gov/vote?auth=${auth}`,
        dotsOptions: { type: 'classy-rounded' },
        height: 128,
        qrOptions: { errorCorrectionLevel: 'M' },
        width: 128,
      })
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [auth])

  return (
    <div className="flex max-w-[11rem] flex-col items-center gap-2">
      <div aria-label="QR code containing your voting link" className="size-32 shrink-0" ref={ref} />
      <p className="whitespace-nowrap text-center font-mono26 text-[0.5rem] leading-snug text-h26-muted">
        local.gov/vote?auth=
        <span className="rounded border border-[#e67e37] bg-[#e67e3744] px-0.5 text-h26-text">{auth}</span>
      </p>
    </div>
  )
}
