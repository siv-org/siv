import type { ConventionSet } from 'api/conventions/[convention_id]/download-set'

import { useRouter } from 'next/router'
import { Head } from 'src/Head'
import useSWR from 'swr'
import TimeAgo from 'timeago-react'

import { QRCode } from './QRCode'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const DownloadQRsPage = () => {
  const { c, set } = useRouter().query

  // Download voters on page load
  const { data, error, isLoading } = useSWR(
    !c || !set ? null : `/api/conventions/${c}/download-set?set=${set}`,
    fetcher,
  )

  // Handle error conditions
  if (!c || typeof c !== 'string') return <p className="p-4">Missing convention_id</p>
  if (!set || typeof set !== 'string') return <p className="p-4">Missing set</p>
  if (error) return <p className="p-4">Error: {JSON.stringify(error)}</p>

  // console.log('swr ran:', { c, data, isLoading, set })
  if (!data || isLoading) return <p className="p-4">Loading...</p>

  const { convention_title, qrs } = data as ConventionSet
  if (!qrs.length) return <p className="p-4">Empty set</p>

  const createdAt = new Date(qrs[0].createdAt._seconds * 1000)

  const sortedQrs = qrs.sort((a, b) => a.index - b.index)

  return (
    <div className="p-4 overflow-auto">
      <Head title={`${qrs.length} for ${convention_title}`} />

      {/* Header row */}
      <p className="flex justify-between">
        <span className="font-bold">Right Click {'→'} Print </span>

        <span>
          {convention_title}: Set of {qrs.length}
        </span>

        <span>
          <span className="text-sm"> Created </span>
          {createdAt.toLocaleString()} <span className="text-sm opacity-60">({<TimeAgo datetime={createdAt} />})</span>
        </span>
      </p>

      {/* Grid of QRs */}
      <div className="-mx-2.5">
        {sortedQrs.map(({ index, qr_id }, i) => (
          <div className="mx-2.5 my-1.5 text-center inline-block break-inside-avoid" key={i}>
            <span className="text-sm opacity-50">{qr_id}</span>
            <QRCode {...{ convention_id: c, qr_id }} />
            <span>{index}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
