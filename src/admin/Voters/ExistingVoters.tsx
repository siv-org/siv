import { EditOutlined } from '@ant-design/icons'
import { useEffect, useReducer, useState } from 'react'

import { api } from '../../api-helper'
import { OnClickButton } from '../../landing-page/Button'
import { revalidate, use_stored_info } from '../load-existing'

export const ExistingVoters = () => {
  const { election_id, voters } = use_stored_info()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const [checked, set_checked] = useState(new Array(voters?.length).fill(false))
  const num_checked = checked.filter((c) => c).length

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
        <OnClickButton
          disabled={!num_checked}
          style={{ margin: 0, padding: '5px 10px' }}
          onClick={async () => {
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
          }}
        >
          <>
            Send {num_checked} Invitation{num_checked === 1 ? '' : 's'}
          </>
        </OnClickButton>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(event) => {
                  const new_checked = [...checked]
                  new_checked.fill(event.target.checked)
                  set_checked(new_checked)
                }}
              />
            </th>
            <th>#</th>
            <th>email</th>
            <th className="auth-header" onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th>voted</th>
          </tr>
        </thead>
        <tbody>
          {voters?.map(({ auth_token, email, has_voted }, index) => (
            <tr key={email}>
              <td>
                <input
                  checked={checked[index]}
                  type="checkbox"
                  onChange={() => {
                    const new_checked = [...checked]
                    new_checked[index] = !checked[index]
                    set_checked(new_checked)
                  }}
                />
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

        .auth-header:hover {
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