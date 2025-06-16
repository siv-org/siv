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
  const storeReview = (review: 'approve' | 'pending' | 'reject', setIsShown: (setting: boolean) => void) => async () =>
    (await api(`election/${election_id}/admin/review-signature`, {
      emails: [email],
      review,
    })) && setIsShown(false)

  const status = getStatus(esignature_review)

  return (
    <td className="px-0.5 hover:bg-black/5 cursor-pointer border border-solid border-[#ccc]">
      <Tooltip
        className="w-72"
        enterDelay={200}
        leaveDelay={200}
        placement="top"
        tooltip={({ setIsShown }: { setIsShown: (setting: boolean) => void }) => (
          <div>
            {esignature ? <img className="max-w-[280px]" src={esignature} /> : <p>Signature missing</p>}
            <div className="flex justify-between">
              <a
                className={`cursor-pointer ${status === 'reject' && 'font-bold'}`}
                onClick={storeReview(status === 'reject' ? 'pending' : 'reject', setIsShown)}
              >
                ❌ Reject{status === 'reject' ? 'ed' : ''}
              </a>
              <a
                className={`cursor-pointer ${status === 'approve' && 'font-bold'}`}
                onClick={storeReview(status === 'approve' ? 'pending' : 'approve', setIsShown)}
              >
                ✅ Approve{status === 'approve' ? 'd' : ''}
              </a>
            </div>
          </div>
        )}
      >
        <img
          className="min-h-5 max-w-[100px] -mb-1.5 overflow-hidden"
          src={esignature}
          style={{ border: `2px solid ${status === 'approve' ? 'green' : status === 'reject' ? 'red' : '#fff0'}` }}
        />
      </Tooltip>
    </td>
  )
}
