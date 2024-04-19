import { QRCode } from './QRCode'

export const QRFigure = ({ className, convention_id = ':conv_id' }: { className?: string; convention_id?: string }) => (
  <figure className={`mx-0 inline-block ${className}`}>
    <div className="flex items-center">
      {/* Left of arrow */}
      <div className="text-center">
        <QRCode {...{ convention_id }} className="relative scale-75 top-3" />
        <span className="text-xs opacity-70">QR code</span>
      </div>
      {/* Arrow */}
      <i
        className="pl-3 pr-6 text-[30px] opacity-80"
        style={{ fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        {'→'}
      </i>{' '}
      {/* Right of Arrow */}
      <i className="relative top-0.5 overflow-auto break-words">siv.org/c/{convention_id}/:qr_id</i>
    </div>
  </figure>
)
