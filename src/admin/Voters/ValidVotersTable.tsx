import { EditOutlined } from '@ant-design/icons'
import { validate as validateEmail } from 'email-validator'
import { useReducer, useState } from 'react'
import { api } from 'src/api-helper'

import { revalidate, useStored } from '../useStored'
import { CheckboxCell, CheckboxHeaderCell, hoverable } from './CheckboxCell'
import { DeliveriesAndFailures } from './DeliveriesAndFailures'
import { mask } from './mask-token'
import { QueuedCell } from './QueuedCell'
import { getStatus, Signature } from './Signature'
import { use_multi_select } from './use-multi-select'
import { useVoterInvites } from './useVoterInvites'

export const ValidVotersTable = ({
  checked,
  hide_approved,
  hide_voted,
  num_voted,
  set_checked,
}: {
  checked: boolean[]
  hide_approved: boolean
  hide_voted: boolean
  num_voted: number
  set_checked: (checked: boolean[]) => void
}) => {
  const { election_id, esignature_requested, voters } = useStored()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const { last_selected, pressing_shift, set_last_selected } = use_multi_select()
  const [showAll, setShowAll] = useState(false)

  const voterInvites = useVoterInvites()

  if (!voters) return null

  const shown_voters = voters.filter(
    ({ esignature_review, has_voted, invalidated }) =>
      !invalidated && (!has_voted || !hide_voted) && (getStatus(esignature_review) !== 'approve' || !hide_approved),
  )

  const shouldShowRegistrationColumns =
    // eslint-disable-next-line no-prototype-builtins
    shown_voters.some((voter) => voter.hasOwnProperty('is_email_verified'))

  // Pagination logic
  const pageSize = 200
  const totalPages = Math.ceil(shown_voters.length / pageSize)
  const page = 1
  const onThisPage = shown_voters.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <div>Approved Voters</div>
      <table className="block w-full mt-1 pb-3 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px]">
        <thead>
          <tr className="bg-[#f9f9f9] text-[11px]">
            <CheckboxHeaderCell {...{ checked, set_checked, set_last_selected }} />
            <th>#</th>
            {shouldShowRegistrationColumns && (
              <>
                <th>first name</th>
                <th>last name</th>
              </>
            )}
            <th>email</th>
            {shouldShowRegistrationColumns && <th>email verified?</th>}
            <th className={hoverable} onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th className="w-[50px]">invite queued</th>
            <th className="w-[50px]">invite delivered</th>
            <th>voted</th>
            {esignature_requested && (
              <th
                className={hoverable}
                onClick={() => {
                  if (confirm(`Do you want to approve all ${num_voted} signatures?`)) {
                    api(`election/${election_id}/admin/review-signature`, {
                      auths: shown_voters.filter(({ has_voted }) => has_voted).map((v) => v.auth_token),
                      review: 'approve',
                    })
                  }
                }}
              >
                signature
              </th>
            )}
          </tr>
        </thead>
        <tbody className="[&_td]:whitespace-nowrap bg-white">
          {(showAll ? shown_voters : onThisPage).map(
            (
              {
                auth_token,
                email,
                esignature,
                esignature_review,
                first_name,
                has_voted,
                invite_queued,
                is_email_verified,
                last_name,
                mailgun_events,
              },
              index,
            ) => (
              <tr className={`${checked[index] && 'bg-[#f1f1f1]'}`} key={email}>
                <CheckboxCell {...{ checked, index, last_selected, pressing_shift, set_checked, set_last_selected }} />

                <td>{index + 1}</td>
                {shouldShowRegistrationColumns && (
                  <>
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                  </>
                )}

                <td>
                  <span className="flex justify-between group">
                    <span>{email}</span>
                    {/* Edit email btn */}
                    <span
                      className="group-hover:opacity-50 opacity-0 cursor-pointer hover:!opacity-100"
                      onClick={async () => {
                        const new_email = prompt('Edit email?', email)

                        if (!new_email || new_email === email) return

                        if (!validateEmail(new_email)) return alert(`Invalid email: '${new_email}'`)

                        // Store new email in API
                        const response = await api(`election/${election_id}/admin/edit-voter-email`, {
                          auth_token,
                          new_email,
                        })

                        if (response.status === 201) {
                          revalidate(election_id)
                        } else {
                          console.error(response.json())
                          // throw await response.json()
                        }
                      }}
                    >
                      &nbsp;
                      <EditOutlined />
                    </span>
                  </span>
                </td>
                {shouldShowRegistrationColumns && <td className="text-center">{is_email_verified ? '✓' : ''}</td>}
                <td className="font-mono text-[12px]">{mask_tokens ? mask(auth_token) : auth_token}</td>

                <QueuedCell {...{ invite_queued }} />
                <DeliveriesAndFailures {...mailgun_events} deliveries={voterInvites[email]} />

                <td className="font-bold text-center">{has_voted ? '✓' : ''}</td>

                {esignature_requested &&
                  (has_voted ? <Signature {...{ auth_token, election_id, esignature, esignature_review }} /> : <td />)}
              </tr>
            ),
          )}
        </tbody>
      </table>
      {totalPages > 1 && !showAll && (
        <div className="text-[13px] mt-2.5">
          Showing only first {pageSize} of {shown_voters.length}.{' '}
          <a className="cursor-pointer" onClick={() => setShowAll(true)}>
            (Show All)
          </a>
        </div>
      )}
    </>
  )
}
