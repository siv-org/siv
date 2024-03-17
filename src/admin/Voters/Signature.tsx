import { ReviewLog } from 'api/election/[election_id]/admin/load-admin'

import { api } from '../../api-helper'
import { Tooltip } from './Tooltip'

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
  const storeReview = (review: 'approve' | 'reject' | 'pending', setIsShown: (setting: boolean) => void) => async () =>
    (await api(`election/${election_id}/admin/review-signature`, {
      emails: [email],
      review,
    })) && setIsShown(false)

  const status = getStatus(esignature_review)

  return (
    <td>
      <Tooltip
        className="w-72"
        enterDelay={200}
        leaveDelay={200}
        placement="top"
        tooltip={({ setIsShown }: { setIsShown: (setting: boolean) => void }) => (
          <div className="tooltip">
            {esignature ? <img src={esignature} /> : <p>Signature missing</p>}
            <div className="row">
              <a
                className={status === 'reject' ? 'bold' : ''}
                onClick={storeReview(status === 'reject' ? 'pending' : 'reject', setIsShown)}
              >
                ❌ Reject{status === 'reject' ? 'ed' : ''}
              </a>
              <a
                className={status === 'approve' ? 'bold' : ''}
                onClick={storeReview(status === 'approve' ? 'pending' : 'approve', setIsShown)}
              >
                ✅ Approve{status === 'approve' ? 'd' : ''}
              </a>
            </div>
          </div>
        )}
      >
        <img className={`small ${status || ''}`} src={esignature} />
      </Tooltip>
      <style jsx>{`
        td {
          border: 1px solid #ccc;
          margin: 0;
          padding: 2px;
        }

        td:hover {
          cursor: pointer;
          background-color: #f2f2f2;
        }

        img.small {
          min-height: 20px;
          max-width: 100px;
          overflow: hidden;
          border: 2px solid #fff0;
          margin-bottom: -6px;
        }

        img.small.approve {
          border-color: green;
        }

        img.small.reject {
          border-color: red;
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
