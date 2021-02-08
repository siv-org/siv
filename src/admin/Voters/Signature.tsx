import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'

import { ReviewLog } from '../../../pages/api/election/[election_id]/admin/load-admin'
import { api } from '../../api-helper'
import { revalidate } from '../useStored'

const useStyles = makeStyles(() => ({
  customWidth: {
    width: 300,
  },
}))

export const Signature = ({
  election_id,
  email,
  esignature,
  esignature_review,
}: {
  election_id?: string
  email: string
  esignature?: string
  esignature_review: ReviewLog[]
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const storeReview = (review: 'approve' | 'reject') => async () => {
    await api(`election/${election_id}/admin/review-signature`, {
      email,
      password: localStorage.password,
      review,
    })
    setOpen(false)
    revalidate(election_id)
  }

  const status = esignature_review ? esignature_review[esignature_review.length - 1]?.review : undefined

  return (
    <td>
      <Tooltip
        interactive
        className={classes.customWidth}
        open={open}
        placement="top"
        title={
          <div className="tooltip">
            <img src={esignature} />
            <div className="row">
              <a onClick={storeReview('reject')}>👎 Reject</a>
              <a onClick={storeReview('approve')}>👍 Approve</a>
            </div>
          </div>
        }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
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
      `}</style>
    </td>
  )
}
