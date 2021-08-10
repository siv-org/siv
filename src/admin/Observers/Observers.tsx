import { EditOutlined } from '@ant-design/icons'
import { TextField } from '@material-ui/core'
import { validate as validateEmail } from 'email-validator'
import { useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { DeliveriesAndFailures } from '../Voters/DeliveriesAndFailures'
import { EncryptionAddress } from './EncryptionAddress'

export type Trustee = { email: string; error?: string; name?: string }
const admin_email = 'admin@secureinternetvoting.org'

export const Observers = () => {
  const { election_id, threshold_public_key, trustees } = useStored()
  const [new_trustees, set_new_trustees] = useState<Trustee[]>([{ email: '' }])

  // Auto run api/check-voter-invite-status when there are pending invites
  const num_invited = trustees?.reduce(
    (acc: { delivered: number; failed: number }, trustee) => {
      if (trustee.mailgun_events?.delivered) acc.delivered += trustee.mailgun_events.delivered.length
      if (trustee.mailgun_events?.failed) acc.failed += trustee.mailgun_events.failed.length
      return acc
    },
    { delivered: 0, failed: 0 },
  )
  const pending_invites = trustees && num_invited && trustees.length > num_invited.delivered + num_invited.failed + 1 // +1 for admin@
  const [last_num_events, set_last_num_events] = useState(0)
  useEffect(() => {
    if (pending_invites) {
      const interval = setInterval(() => {
        console.log('Checking pending invites...')
        api(`election/${election_id}/admin/check-trustee-invite-status`)
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

  return (
    <div className="container">
      <h2>
        Verifying Observers <span>(Optional)</span>
      </h2>
      <p>
        SIV always ensures vote privacy & accuracy. For additional security, Verifying Observers also get complete
        cryptographic proof that votes are private & tallied correctly.
      </p>
      <p>
        If you add them, votes cannot be unlocked and tallied until their computers run the automatic verification
        checks.
      </p>
      <br />

      {!trustees?.length ? (
        <div>
          <p>
            <i>Verifying Observers:</i>
          </p>
          {new_trustees.map((_, i) => (
            <div className="row" key={i}>
              <span>{i + 1}.</span>
              <TextField
                error={!!new_trustees[i].error}
                helperText={new_trustees[i].error}
                label="Email"
                size="small"
                style={{ marginBottom: 5, marginRight: 15, width: 220 }}
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
                className="name-input"
                id={`name-input-${i}`}
                label="Name"
                size="small"
                style={{ width: 220 }}
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
              !new_trustees.some((t) => t.email || t.name)
                ? 'Skip'
                : `Finalize & Send Invitation${new_trustees.length > 1 ? 's' : ''}`
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

                if (!validateEmail(email)) {
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
                revalidate(election_id)
              } else {
                throw await response.json()
              }
            }}
          />
        </div>
      ) : (
        trustees.length > 1 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>email</th>
                <th>name</th>
                <th style={{ width: 50 }}>invite delivered</th>
                <th style={{ width: 100 }}>setup stage completed</th>
              </tr>
            </thead>
            <tbody>
              {trustees.slice(1).map(({ email, mailgun_events, name, stage = 0 }, index) => (
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

                          if (!validateEmail(new_email)) return alert(`Invalid email: '${new_email}'`)

                          // Store new email in API
                          const response = await api(`election/${election_id}/admin/edit-trustee-email`, {
                            new_email,
                            old_email: email,
                          })

                          if (response.status === 201) {
                            revalidate(election_id)
                          } else {
                            const json = await response.json()
                            console.error(json)
                            alert(json.error)
                          }
                        }}
                      >
                        &nbsp;
                        <EditOutlined />
                      </span>
                    </span>
                  </td>
                  <td>{name}</td>
                  {email === admin_email ? (
                    <td style={{ textAlign: 'center' }}>✓</td>
                  ) : (
                    <DeliveriesAndFailures {...mailgun_events} checkmarkOnly />
                  )}

                  <td style={{ textAlign: 'center' }}>{stage} of 12</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      {(trustees?.length || 0) > 1 && !threshold_public_key && (
        <p>
          <br />
          <i>Waiting on Verifying Observers to complete the Pre-Election setup...</i>
        </p>
      )}
      <EncryptionAddress />
      <style global jsx>{`
        @media (max-width: 780px) {
          .name-input {
            margin-left: 47px;
            margin-top: 7px;
          }

          #default-trustee {
            display: block;
          }
        }
      `}</style>
      <style jsx>{`
        /* When sidebar disappears */
        @media (max-width: 500px) {
          h2 {
            display: none;
          }
        }

        h2 span {
          font-size: 12px;
          font-weight: 500;
          margin-left: 5px;
          opacity: 0.8;
        }

        li {
          padding-left: 8px;
          margin-bottom: 5px;
        }

        li span {
          margin-right: 26px;
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
