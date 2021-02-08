import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'

import { ReviewLog } from '../../../pages/api/election/[election_id]/admin/load-admin'
import { api } from '../../api-helper'

const useStyles = makeStyles(() => ({
  customWidth: {
    width: 300,
  },
}))

export const getStatus = (esignature_review?: ReviewLog[]) =>
  esignature_review ? esignature_review[esignature_review.length - 1]?.review : undefined

export const Signature = ({
  election_id,
  email,
  esignature,
  esignature_review,
}: {
  election_id?: string
  email: string
  esignature?: string
  esignature_review?: ReviewLog[]
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const storeReview = (review: 'approve' | 'reject' | 'pending') => async () => {
    await api(`election/${election_id}/admin/review-signature`, {
      emails: [email],
      password: localStorage.password,
      review,
    })
    setOpen(false)
  }

  const status = getStatus(esignature_review)

  return (
    <td>
      <Tooltip
        interactive
        className={classes.customWidth}
        open={open}
        placement="top"
        title={
          <div className="tooltip">
            {esignature ? <img src={esignature} /> : <p>Signature missing</p>}
            <div className="row">
              <a
                className={status === 'reject' ? 'bold' : ''}
                onClick={storeReview(status === 'reject' ? 'pending' : 'reject')}
              >
                👎 Reject{status === 'reject' ? 'ed' : ''}
              </a>
              <a
                className={status === 'approve' ? 'bold' : ''}
                onClick={storeReview(status === 'approve' ? 'pending' : 'approve')}
              >
                👍 Approve{status === 'approve' ? 'd' : ''}
              </a>
            </div>
          </div>
        }
        onClick={() => setOpen(!open)}
        onClose={() => setOpen(false)}
        onOpen={() => status || setOpen(true)}
      >
        <img className={`small ${status || ''}`} src={esignature} />
      </Tooltip>
      <style jsx>{`
        td {
          border: 1px solid #ccc;
          margin: 0;
        }

        td:hover {
          cursor: pointer;
          background-color: #f2f2f2;
        }

        img.small {
          min-height: 20px;
          max-width: 100px;
          overflow: hidden;
        }

        img.small.approve {
          border: 2px solid green;
        }

        img.small.reject {
          border: 2px solid red;
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

        .tooltip a:first-child {
          margin-right: 2rem;
        }

        .bold {
          font-weight: bold;
        }
      `}</style>
    </td>
  )
}
