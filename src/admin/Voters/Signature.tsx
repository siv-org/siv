import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { api } from '../../api-helper'

const useStyles = makeStyles(() => ({
  customWidth: {
    width: 300,
  },
}))

export const Signature = ({
  election_id,
  email,
  esignature,
}: {
  election_id?: string
  email: string
  esignature?: string
}) => {
  const classes = useStyles()

  const storeReview = (review: 'approve' | 'reject') =>
    api(`election/${election_id}/admin/review-signature`, {
      email,
      password: localStorage.password,
      review,
    })

  return (
    <td>
      <Tooltip
        interactive
        className={classes.customWidth}
        placement="top"
        title={
          <div className="tooltip">
            <img src={esignature} />
            <div className="row">
              <a
                onClick={() => {
                  storeReview('reject')
                }}
              >
                👎 Reject
              </a>
              <a
                onClick={() => {
                  storeReview('approve')
                }}
              >
                👍 Approve
              </a>
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
          font-size: 12px;
        }
      `}</style>
    </td>
  )
}
