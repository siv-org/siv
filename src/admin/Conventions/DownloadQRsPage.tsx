import { useRouter } from 'next/router'

import { QRCode } from './QRCode'

export const DownloadQRsPage = () => {
  const {
    query: { n },
  } = useRouter()

  if (!n || !Number(n) || isNaN(Number(n))) return <p className="p-4">Invalid number</p>

  return (
    <div className="p-4 overflow-auto">
      <p>Right Click {'→'} Print</p>

      <div className="flex flex-wrap -mx-2.5">
        {new Array(Number(n || 0)).fill(0).map((_, i) => (
          <span className="mx-2.5 my-1.5 text-center" key={i}>
            <QRCode />
            <span>{i + 1}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
