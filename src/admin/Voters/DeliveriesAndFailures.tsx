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
