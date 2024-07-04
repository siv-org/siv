import { Tooltip } from './Tooltip'

export const QueuedCell = ({ invite_queued }: { invite_queued?: unknown[] }) => {
  return (
    <>
      <Tooltip
        placement="top"
        tooltip={
          invite_queued ? (
            <>
              {(
                invite_queued as {
                  time: { _seconds: number }
                }[]
              )?.map((event, index) => (
                <div key={index} style={{ fontSize: 14 }}>
                  {new Date(event.time._seconds * 1000).toLocaleString()}
                </div>
              ))}
            </>
          ) : (
            ''
          )
        }
      >
        <td style={{ textAlign: 'center' }}>{invite_queued?.length}</td>
      </Tooltip>
      <style jsx>{`
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }
      `}</style>
    </>
  )
}
