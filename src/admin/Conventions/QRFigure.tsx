import { QRCode } from './QRCode'

export const QRFigure = ({ convention_id }: { convention_id?: string }) => (
  <figure className="mx-0 mt-12 -ml-4">
    <div className="flex items-center">
      <div className="text-center">
        <QRCode {...{ convention_id }} className="relative scale-75 top-3" />
        <span className="text-xs opacity-70">QR code</span>
      </div>
      <i
        className="pl-3 pr-6 text-[30px] opacity-80"
        style={{ fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        {'→'}
      </i>{' '}
      <i className="relative top-0.5 overflow-auto break-words">siv.org/c/{convention_id}/:voter_id</i>
    </div>
  </figure>
)
