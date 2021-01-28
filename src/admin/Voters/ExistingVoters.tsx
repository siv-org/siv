import { EditOutlined } from '@ant-design/icons'
import { useEffect, useReducer, useState } from 'react'

import { api } from '../../api-helper'
import { OnClickButton } from '../../landing-page/Button'
import { revalidate, use_stored_info } from '../load-existing'
import { Spinner } from '../Spinner'

export const ExistingVoters = () => {
  const { election_id, voters } = use_stored_info()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const [checked, set_checked] = useState(new Array(voters?.length).fill(false))
  const num_checked = checked.filter((c) => c).length
  const num_voted = voters?.filter((v) => v.has_voted).length
  const [unlocking, toggle_unlocking] = useReducer((state) => !state, false)
  const [sending, toggle_sending] = useReducer((state) => !state, false)

  // Logic to handle multi-select (holding shift)
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

  // Grow checked array to match voters list
  useEffect(() => {
    if (voters && checked.length !== voters.length) {
      const new_checked = [...checked]
      new_checked.length = voters.length
      set_checked(new_checked)
    }
  }, [voters?.length])

  // Don't show anything if we don't have any voters yet
  if (!voters?.length) return null

  return (
    <>
      <div style={{ marginBottom: 5 }}>
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

            const response = await api(`election/${election_id}/admin/invite-voters`, {
              password: localStorage.password,
              voters: voters_to_invite,
            })

            if (response.status === 201) {
              revalidate(election_id)
            } else {
              console.error(response.json())
            }
            toggle_sending()
          }}
        >
          <>
            {sending && <Spinner />}
            Send{sending ? 'ing' : ''} {num_checked} Invitation{num_checked === 1 ? '' : 's'}
          </>
        </OnClickButton>

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

      <table>
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
            <th>email</th>
            <th className="hoverable" onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th style={{ width: 50 }}>invite queued</th>
            <th>voted</th>
          </tr>
        </thead>
        <tbody>
          {voters?.map(({ auth_token, email, has_voted, invite_queued }, index) => (
            <tr key={email}>
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
              <td>{index + 1}</td>
              <td>
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{email}</span>
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
                </span>
              </td>
              <td style={{ fontFamily: 'monospace' }}>{mask_tokens ? mask(auth_token) : auth_token}</td>
              <td style={{ textAlign: 'center' }}>{invite_queued?.length}</td>
              <td style={{ fontWeight: 700, textAlign: 'center' }}>{has_voted ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        a {
          cursor: pointer;
        }

        table {
          border-collapse: collapse;
          display: block;
          overflow: scroll;
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
