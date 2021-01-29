import { Tooltip } from '@material-ui/core'

export const AcceptedCell = ({ accepted }: { accepted?: unknown[] }) => {
  return (
    <>
      <Tooltip
        interactive
        placement="top"
        title={
          accepted ? (
            <>
              {(accepted as {
                id: string
                timestamp: number
              }[])?.map((event) => (
                <div key={event.id} style={{ fontSize: 14 }}>
                  {new Date(event.timestamp * 1000).toLocaleString()}
                </div>
              ))}
            </>
          ) : (
            ''
          )
        }
      >
        <td style={{ textAlign: 'center' }}>{accepted?.length}</td>
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
