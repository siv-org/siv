import { EditOutlined } from '@ant-design/icons'
import { useEffect, useReducer, useState } from 'react'

import { api } from '../../api-helper'
import { OnClickButton } from '../../landing-page/Button'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'
import { DeliveredFailureCell } from './DeliveredFailureCell'
import { QueuedCell } from './QueuedCell'

export const ExistingVoters = ({ readOnly }: { readOnly?: boolean }) => {
  const { election_id, voters } = useStored()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const [checked, set_checked] = useState(new Array(voters?.length).fill(false))
  const num_checked = checked.filter((c) => c).length
  const num_voted = voters?.filter((v) => v.has_voted).length || 0
  const [unlocking, toggle_unlocking] = useReducer((state) => !state, false)
  const [sending, toggle_sending] = useReducer((state) => !state, false)
  const [error, set_error] = useState('')

  const { last_selected, pressing_shift, set_last_selected } = use_multi_select()

  // Grow checked array to match voters list
  useEffect(() => {
    if (voters && checked.length !== voters.length) {
      const new_checked = [...checked]
      new_checked.length = voters.length
      set_checked(new_checked)
    }
  }, [voters?.length])

  // Auto run api/check-invite-status when there are pending invites
  const num_invited = voters?.reduce(
    (acc: { delivered: number; failed: number; queued: number }, voter) => {
      if (voter.invite_queued) acc.queued += voter.invite_queued.length
      if (voter.mailgun_events?.delivered) acc.delivered += voter.mailgun_events.delivered.length
      if (voter.mailgun_events?.failed) acc.failed += voter.mailgun_events.failed.length
      return acc
    },
    { delivered: 0, failed: 0, queued: 0 },
  )
  const pending_invites = num_invited && num_invited.queued > num_invited.delivered + num_invited.failed
  const [last_num_events, set_last_num_events] = useState(0)
  useEffect(() => {
    if (pending_invites) {
      const interval = setInterval(() => {
        console.log('Checking pending invites...')
        api(`election/${election_id}/admin/check-invite-status?password=${localStorage.password}`)
          .then((response) => response.json())
          .then(({ num_events }) => {
            if (num_events !== last_num_events) {
              revalidate(election_id)
              set_last_num_events(num_events)
            }
          })
      }, 1000)
      return () => {
        console.log('All invites delivered 👍')
        clearInterval(interval)
      }
    }
  }, [pending_invites])

  // Don't show anything if we don't have any voters yet
  if (!voters?.length) return null

  return (
    <>
      {/* Top bar buttons */}
      {!readOnly && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          {/* Send Invitations btn */}
          <OnClickButton
            disabled={!num_checked}
            style={{ margin: 0, padding: '5px 10px' }}
            onClick={async () => {
              toggle_sending()
              const voters_to_invite = checked.reduce((acc: string[], is_checked, index) => {
                if (is_checked) acc.push(voters[index].email)
                return acc
              }, [])

              try {
                const response = await api(`election/${election_id}/admin/invite-voters`, {
                  password: localStorage.password,
                  voters: voters_to_invite,
                })

                if (response.status === 201) {
                  revalidate(election_id)
                } else {
                  const json = await response.json()
                  console.error(json)
                  set_error(json?.error || 'Error w/o message ')
                }
              } catch (e) {
                set_error(e.message || 'Caught error w/o message')
              }

              toggle_sending()
            }}
          >
            <>
              {sending && <Spinner />}
              Send{sending ? 'ing' : ''} {num_checked} Invitation{num_checked === 1 ? '' : 's'}
            </>
          </OnClickButton>

          {error && (
            <span className="error">
              <b> ⚠️ Error:</b> {error}
              <a onClick={() => set_error('')}>x</a>
            </span>
          )}

          {/* Unlock Votes btn */}
          <OnClickButton
            disabled={!num_voted}
            style={{ margin: 0, marginLeft: 5, padding: '5px 10px' }}
            onClick={async () => {
              toggle_unlocking()
              const response = await api(`election/${election_id}/admin/unlock?password=${localStorage.password}`)
              if (response.status !== 201) {
                const json = await response.json()
                alert(json)
                console.error('Unlocking error:', json)
              }
              toggle_unlocking()
            }}
          >
            <>
              {unlocking && <Spinner />}
              Unlock{unlocking ? 'ing' : ''} {num_voted} Vote{num_voted === 1 ? '' : 's'}
            </>
          </OnClickButton>
        </div>
      )}

      <p>
        <i>
          {num_voted} of {voters.length} voted ({Math.round((num_voted / voters.length) * 100)}%)
        </i>
      </p>

      <table>
        <thead>
          <tr>
            {!readOnly && (
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
            )}
            <th>#</th>
            <th>email</th>
            <th className="hoverable" onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th style={{ width: 50 }}>invite queued</th>
            <th style={{ width: 50 }}>invite delivered</th>
            <th>voted</th>
          </tr>
        </thead>
        <tbody>
          {voters?.map(({ auth_token, email, has_voted, invite_queued, mailgun_events }, index) => (
            <tr className={`${checked[index] ? 'checked' : ''}`} key={email}>
              {/* Checkbox cell */}
              {!readOnly && (
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
                  <input readOnly checked={checked[index]} className="hoverable" type="checkbox" />
                </td>
              )}
              <td>{index + 1}</td>
              <td>
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{email}</span>
                  {/* Edit email btn */}
                  {!readOnly && (
                    <span
                      className="visible-on-parent-hover"
                      onClick={async () => {
                        const new_email = prompt('Edit email?', email)

                        // TODO: check if is_valid_email(new_email)
                        if (!new_email || new_email === email) return

                        // Store new email in API
                        const response = await api(`election/${election_id}/admin/edit-email`, {
                          new_email,
                          old_email: email,
                          password: localStorage.password,
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
                  )}
                </span>
              </td>
              <td style={{ fontFamily: 'monospace' }}>{mask_tokens ? mask(auth_token) : auth_token}</td>

              <QueuedCell {...{ invite_queued }} />
              <DeliveredFailureCell {...mailgun_events} />

              <td style={{ fontWeight: 700, textAlign: 'center' }}>{has_voted ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .error {
          align-self: center;
          border: 1px solid rgba(131, 1, 1, 0.776);
          border-radius: 3px;
          padding: 3px 10px;
          background: rgb(255, 246, 246);
        }

        .error a {
          margin-left: 10px;
          cursor: pointer;
        }

        table {
          border-collapse: collapse;
          display: block;
          overflow: scroll;
          width: 100%;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
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
    </>
  )
}

const mask = (string: string) => `${string.slice(0, 2)}......${string.slice(-2)}`

/** Logic for checkbox multi-select (holding shift) */
const use_multi_select = () => {
  const [pressing_shift, set_shift] = useState(false)
  const [last_selected, set_last_selected] = useState<number>()
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Shift') set_shift(false)
  }
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Shift') set_shift(true)
  }
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp, false)
    document.addEventListener('keydown', handleKeyDown, false)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return { last_selected, pressing_shift, set_last_selected }
}
