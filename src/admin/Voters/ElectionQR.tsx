import { FullscreenOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

import { useStored } from '../useStored'

export const ElectionQR = ({ url }: { url: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { pending_votes, valid_voters } = useStored()
  const num_votes = (valid_voters?.filter((v) => v.has_voted).length || 0) + (pending_votes?.length || 0)

  // Render small QR on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return // Client-side only

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!ref.current) return console.warn('Missing QR container ref')
      const qrCode = new QRCodeStyling({ data: url, height: 90, width: 90 })
      if (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild)
      qrCode.append(ref.current)
    })
  }, [])

  // Render big QR when modal opened
  useEffect(() => {
    if (isModalOpen && typeof window !== 'undefined') {
      import('qr-code-styling').then(({ default: QRCodeStyling }) => {
        if (!modalRef.current) return console.warn('Missing modal QR container ref')
        const qrCode = new QRCodeStyling({
          data: url,
          height: 300,
          margin: 10,
          width: 300,
        })
        if (modalRef.current.firstChild) modalRef.current.removeChild(modalRef.current.firstChild)
        qrCode.append(modalRef.current)
      })
    }
  }, [isModalOpen, url])

  const handleClose = () => setIsModalOpen(false)

  return (
    <>
      {/* Small QR Code */}
      <div className="flex flex-col items-center">
        <div
          {...{ ref }}
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          title="Click to view larger QR code"
        />
        <button
          className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-transparent border-none p-0"
          onClick={() => setIsModalOpen(true)}
        >
          <FullscreenOutlined className="text-[14px]" />
          <span>Click to show fullscreen</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50"
          onClick={(e: React.MouseEvent) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div className="relative p-8 mx-4 max-w-sm bg-white rounded-lg">
            {/* Close button */}
            <button
              aria-label="Close modal"
              className="absolute top-2 right-2 text-2xl font-bold text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-700"
              onClick={handleClose}
            >
              ×
            </button>

            {/* Big QR code */}
            <div className="flex justify-center" ref={modalRef} />

            {/* Text link */}
            <p className="mt-4 break-all">
              <a href={url} rel="noreferrer" target="_blank">
                {url}
              </a>
            </p>

            {/* Real-time vote count */}
            <p className="mt-4 text-center opacity-80">
              {num_votes} vote{num_votes !== 1 ? 's' : ''} cast
            </p>
          </div>
        </div>
      )}
    </>
  )
}
