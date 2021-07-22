import { EditOutlined } from '@ant-design/icons'
import { TextField } from '@material-ui/core'
import EmailValidator from 'email-validator'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { DeliveredFailureCell } from '../Voters/DeliveredFailureCell'
import { EncryptionAddress } from './EncryptionAddress'

export type Trustee = { email: string; error?: string; name?: string }
const admin_email = 'admin@secureinternetvoting.org'

export const Trustees = () => {
  const { election_id, threshold_public_key, trustees } = useStored()
  const [new_trustees, set_new_trustees] = useState<Trustee[]>([{ email: '' }])

  return (
    <div className="container">
      <h2>Trustees</h2>
      <h4>Each Trustee adds extra redundancy for vote privacy.</h4>
      {!trustees?.length ? (
        <div>
          <ol>
            <li>
              {admin_email}
              <br />
              <span>The SIV server</span>
            </li>
          </ol>
          <p>
            <i>Add more trustees:</i>
          </p>
          {new_trustees.map((_, i) => (
            <div className="row" key={i}>
              <span>{i + 2}.</span>
              <TextField
                autoFocus
                error={!!new_trustees[i].error}
                helperText={new_trustees[i].error}
                label="Email"
                size="small"
                style={{ marginBottom: 5, marginRight: 10 }}
                value={new_trustees[i].email || ''}
                variant="outlined"
                onChange={(event) => {
                  const update = [...new_trustees]
                  update[i].email = event.target.value
                  delete update[i].error
                  set_new_trustees(update)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    document.getElementById(`name-input-${i}`)?.focus()
                  }
                }}
              />
              <TextField
                id={`name-input-${i}`}
                label="Name"
                size="small"
                value={new_trustees[i].name || ''}
                variant="outlined"
                onChange={(event) => {
                  const update = [...new_trustees]
                  update[i].name = event.target.value
                  set_new_trustees(update)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    document.getElementById('add-another')?.click()
                  }
                }}
              />
            </div>
          ))}

          <a id="add-another" onClick={() => set_new_trustees([...new_trustees, { email: '' }])}>
            + Add another
          </a>

          <SaveButton
            text={
              new_trustees.length === 1 && !(new_trustees[0].email || new_trustees[0].name) ? 'Skip' : 'Send Invitation'
            }
            onPress={async () => {
              // Remove empty rows
              const not_empty = new_trustees.filter(({ email, name }) => email || name)
              set_new_trustees(not_empty)

              // Validate emails
              let errored = false
              not_empty.map(({ email }, i) => {
                if (!email) {
                  errored = true
                  const update = [...not_empty]
                  update[i].error = 'Missing email'
                  return set_new_trustees(update)
                }

                if (!EmailValidator.validate(email)) {
                  errored = true
                  const update = [...not_empty]
                  update[i].error = 'Invalid email'
                  return set_new_trustees(update)
                }
              })
              if (errored) return

              const trustees: Trustee[] = not_empty.map(({ email, name }) => ({
                email: email.trim().toLowerCase(),
                name: name?.trim(),
              }))

              const response = await api(`election/${election_id}/admin/add-trustees`, { trustees })

              if (response.status === 201) {
                const { threshold_public_key } = await response.json()
                if (threshold_public_key) revalidate(election_id)
              } else {
                throw await response.json()
              }
            }}
          />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>email</th>
              <th>name</th>
              <th style={{ width: 50 }}>invite delivered</th>
              <th>stage</th>
            </tr>
          </thead>
          <tbody>
            {trustees.map(({ email, mailgun_events, name }, index) => (
              <tr key={email}>
                <td>{index + 1}</td>
                <td>
                  <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{email}</span>
                    {/* Edit email btn */}
                    <span
                      className="visible-on-parent-hover"
                      onClick={async () => {
                        const new_email = prompt('Edit email?', email)

                        if (!new_email || new_email === email) return

                        if (!EmailValidator.validate(new_email)) return alert(`Invalid email: '${new_email}'`)

                        // Store new email in API
                        const response = await api(`election/${election_id}/admin/edit-email`, {
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
                <td>{name}</td>
                <DeliveredFailureCell {...mailgun_events} />

                <td style={{ fontWeight: 700, textAlign: 'center' }}>{'✓'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(trustees?.length || 0) > 1 && !threshold_public_key && (
        <p>
          <i>Waiting on trustees to generate a shared private key...</i>
        </p>
      )}
      <EncryptionAddress />
      <style jsx>{`
        /* When sidebar disappears */
        @media (max-width: 500px) {
          h2 {
            display: none;
          }
        }

        li {
          padding-left: 8px;
          margin-bottom: 5px;
        }

        .row {
          margin-bottom: 15px;
        }

        .row span {
          margin-right: 15px;
          margin-left: 20px;
          position: relative;
          top: 9px;
        }

        .row input {
          margin-right: 15px;
          margin-top: 21px;
          padding: 5px 5px;
        }

        .email-input {
          width: 270px;
        }

        #add-another {
          display: block;
          margin-left: 20px;
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
    </div>
  )
}
