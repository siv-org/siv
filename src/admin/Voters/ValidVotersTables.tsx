import { EditOutlined } from '@ant-design/icons'
import { validate as validateEmail } from 'email-validator'
import { useReducer, useState } from 'react'
import { api } from 'src/api-helper'

import { revalidate, useStored } from '../useStored'
import { DeliveriesAndFailures } from './DeliveriesAndFailures'
import { mask } from './mask-token'
import { QueuedCell } from './QueuedCell'
import { Signature, getStatus } from './Signature'
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
  const { election_id, esignature_requested, voter_applications_allowed, voters } = useStored()
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
    voter_applications_allowed || shown_voters.some((voter) => voter.hasOwnProperty('is_email_verified'))

  // Pagination logic
  const pageSize = 200
  const totalPages = Math.ceil(shown_voters.length / pageSize)
  const page = 1
  const onThisPage = shown_voters.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <table className="pb-3">
        <thead>
          <tr>
            <th>
              <input
                style={{ cursor: 'pointer' }}
                type="checkbox"
                onChange={(event) => {
                  const new_checked = [...checked]
                  new_checked.fill(event.target.checked)
                  set_checked(new_checked)
                  set_last_selected(undefined)
                }}
              />
            </th>
            <th>#</th>
            {shouldShowRegistrationColumns && (
              <>
                <th>first name</th>
                <th>last name</th>
              </>
            )}
            <th>email</th>
            {shouldShowRegistrationColumns && <th>email verified?</th>}
            <th className="hoverable" onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th style={{ width: 50 }}>invite queued</th>
            <th style={{ width: 50 }}>invite delivered</th>
            <th>voted</th>
            {esignature_requested && (
              <th
                className="hoverable"
                onClick={() => {
                  if (confirm(`Do you want to approve all ${num_voted} signatures?`)) {
                    api(`election/${election_id}/admin/review-signature`, {
                      emails: shown_voters.filter(({ has_voted }) => has_voted).map((v) => v.email),
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
        <tbody>
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
              <tr className={`${checked[index] ? 'checked' : ''}`} key={email}>
                {/* Checkbox cell */}

                <td
                  className="hoverable"
                  onClick={() => {
                    const new_checked = [...checked]
                    if (pressing_shift && last_selected !== undefined) {
                      // If they're holding shift, set all between last_selected and this index to !checked[index]
                      for (let i = Math.min(index, last_selected); i <= Math.max(index, last_selected); i += 1) {
                        new_checked[i] = !checked[index]
                      }
                    } else {
                      new_checked[index] = !checked[index]
                    }

                    set_last_selected(index)
                    set_checked(new_checked)
                  }}
                >
                  <input readOnly checked={!!checked[index]} className="hoverable" type="checkbox" />
                </td>
                <td className="show-strikethrough">{index + 1}</td>
                {shouldShowRegistrationColumns && (
                  <>
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                  </>
                )}

                <td className="show-strikethrough">
                  <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{email}</span>
                    {/* Edit email btn */}
                    <span
                      className="visible-on-parent-hover"
                      onClick={async () => {
                        const new_email = prompt('Edit email?', email)

                        if (!new_email || new_email === email) return

                        if (!validateEmail(new_email)) return alert(`Invalid email: '${new_email}'`)

                        // Store new email in API
                        const response = await api(`election/${election_id}/admin/edit-voter-email`, {
                          new_email,
                          old_email: email,
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
                <td className="show-strikethrough" style={{ fontFamily: 'monospace' }}>
                  {mask_tokens ? mask(auth_token) : auth_token}
                </td>

                <QueuedCell {...{ invite_queued }} />
                <DeliveriesAndFailures {...mailgun_events} deliveries={voterInvites[email]} />

                <td style={{ fontWeight: 700, textAlign: 'center' }}>{has_voted ? '✓' : ''}</td>

                {esignature_requested &&
                  (has_voted ? <Signature {...{ election_id, email, esignature, esignature_review }} /> : <td />)}
              </tr>
            ),
          )}
        </tbody>

        <style jsx>{`
          table {
            border-collapse: collapse;
            display: block;
            overflow: auto;
            width: 100%;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 3px 10px;
            margin: 0;
          }

          td {
            white-space: nowrap;
          }

          th {
            background: #f9f9f9;
            font-size: 11px;
          }

          tr.checked {
            background: #f1f1f1;
          }

          .hoverable:hover {
            cursor: pointer;
            background-color: #f2f2f2;
          }

          td .visible-on-parent-hover {
            opacity: 0;
          }
          td:hover .visible-on-parent-hover {
            opacity: 0.5;
          }

          .visible-on-parent-hover:hover {
            cursor: pointer;
            opacity: 1 !important;
          }
        `}</style>
      </table>
      {totalPages > 1 && !showAll && (
        <div style={{ fontSize: 13, marginTop: 10 }}>
          Showing only first {pageSize} of {shown_voters.length}.{' '}
          <a style={{ cursor: 'pointer' }} onClick={() => setShowAll(true)}>
            (Show All)
          </a>
        </div>
      )}
    </>
  )
}
