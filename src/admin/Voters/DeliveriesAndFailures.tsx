import { useEffect } from 'react'

import { Tooltip } from './Tooltip'

export const DeliveriesAndFailures = ({
  checkmarkOnly,
  delivered,
  deliveries,
  failed,
}: {
  checkmarkOnly?: boolean
  delivered?: unknown[]
  deliveries?: string[]
  failed?: unknown[]
}) => {
  // #region agent log
  useEffect(() => {
    if (!failed?.length) return
    const first = failed[0] as Record<string, unknown>
    const ds = first['delivery-status'] as Record<string, unknown> | undefined
    fetch('http://127.0.0.1:7532/ingest/3b7aaa0c-d569-420d-ad8b-a6097c399793', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '99584a' },
      body: JSON.stringify({
        sessionId: '99584a',
        runId: 'pre-fix',
        hypothesisId: 'B',
        location: 'DeliveriesAndFailures.tsx:failed-shape',
        message: 'failed events present for cell',
        data: {
          failedLen: failed.length,
          topKeys: Object.keys(first),
          hasDeliveryStatus: !!ds,
          deliveryStatusKeys: ds ? Object.keys(ds) : [],
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  }, [failed])
  // #endregion

  return (
    <>
      <Tooltip
        placement="top"
        tooltip={
          failed || deliveries ? (
            <>
              {(
                failed as {
                  'delivery-status': { message: string }
                  id: string
                  severity: string
                }[]
              )?.map((event) => (
                <div key={event.id} style={{ fontSize: 14 }}>
                  <b>{event.severity} failure</b>: {event['delivery-status'].message.replace(/5.1.1 /g, '')}
                </div>
              ))}
              {deliveries?.map((time, index) => (
                <div key={index} style={{ fontSize: 14 }}>
                  {new Date(time).toLocaleString()}
                </div>
              ))}
            </>
          ) : (
            ''
          )
        }
      >
        <td style={{ textAlign: 'center' }}>
          <span className="failed-events">
            {(failed as { severity?: string }[])?.filter((e) => e.severity === 'temporary').length ? '⚠️ ' : ''}
          </span>
          {checkmarkOnly ? (delivered ? '✓' : '') : deliveries?.length}
          <span className="failed-events">
            {(failed as { severity?: string }[])?.filter(({ severity }) => severity === 'permanent').length ? ' X' : ''}
          </span>
        </td>
      </Tooltip>
      <style jsx>{`
        td {
          padding: 3px 10px;
          margin: 0;
        }

        .failed-events {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </>
  )
}
