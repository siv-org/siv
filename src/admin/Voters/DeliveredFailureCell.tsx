import { Tooltip } from '@material-ui/core'

export const DeliveredFailureCell = ({ delivered, failed }: { delivered?: unknown[]; failed?: unknown[] }) => {
  return (
    <>
      <Tooltip
        interactive
        placement="top"
        title={
          failed ? (
            <>
              {(failed as {
                'delivery-status': { message: string }
                id: string
                severity: string
              }[])?.map((event) => (
                <div key={event.id} style={{ fontSize: 14 }}>
                  <b>{event.severity} failure</b>: {event['delivery-status'].message.replace(/5.1.1 /g, '')}
                </div>
              ))}
            </>
          ) : (
            ''
          )
        }
      >
        <td style={{ textAlign: 'center' }}>
          {delivered?.length}
          <span className="failed-events">{failed?.length ? 'X' : ''}</span>
        </td>
      </Tooltip>
      <style jsx>{`
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }

        .failed-events {
          color: red;
          font-weight: bold;
        }
      `}</style>
      <style global jsx>{`
        .MuiTooltip-tooltip {
          background: #fffe;
          color: #222;
          box-shadow: 0px 1px 3px #0006;
          padding: 5px 10px;
        }
      `}</style>
    </>
  )
}
