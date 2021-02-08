import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(() => ({
  customWidth: {
    width: 300,
  },
}))

export const Signature = ({ esignature }: { esignature?: string }) => {
  const classes = useStyles()
  return (
    <td>
      <Tooltip
        interactive
        className={classes.customWidth}
        title={
          <div className="tooltip">
            <img src={esignature} />
            <div className="row">
              <a>👎 Reject</a>
              <a>👍 Approve</a>
            </div>
          </div>
        }
      >
        <img className="small" src={esignature} />
      </Tooltip>
      <style jsx>{`
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }

        td:hover {
          cursor: pointer;
          background-color: #f2f2f2;
        }

        img.small {
          max-width: 100px;
        }

        .tooltip img {
          max-width: 280px;
        }

        .row {
          display: flex;
          justify-content: space-between;
        }

        .tooltip a {
          cursor: pointer;
        }
      `}</style>
    </td>
  )
}
