import { EditOutlined, ExportOutlined } from '@ant-design/icons'
import { TextField } from '@mui/material'
import { validate as validateEmail } from 'email-validator'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { DeliveriesAndFailures } from '../Voters/DeliveriesAndFailures'
import { EncryptionAddress } from './EncryptionAddress'
import { useLatestMailgunEvents } from './use-latest-mailgun'

export type Trustee = { email: string; error?: string; name?: string }
const admin_email = 'admin@siv.org'

export const SetPrivacyProtectors = () => {
  const { election_id, election_manager, threshold_public_key, trustees } = useStored()
  const [new_trustees, set_new_trustees] = useState<Trustee[]>([{ email: '' }])

  useLatestMailgunEvents(election_id, trustees, election_manager)

  return (
    <div className="container">
      <h2 className="hidden sm:block">
        Privacy Protectors <span>(Optional)</span>
      </h2>
      <p>
        This lets you give independent Privacy Protectors complete cryptographic proof that votes are private & tallied
        correctly.
      </p>
      <p>
        If you add them, votes cannot be unlocked and tallied until their computers run the automatic verification
        checks.
      </p>
      <p>
        <a href="https://docs.siv.org/privacy/privacy-protectors" rel="noreferrer" target="_blank">
          <ExportOutlined className="mr-1" />
          Learn more
        </a>
      </p>

      <br />

      {!trustees?.length ? (
        <div>
          <p>
            <i>Privacy Protectors:</i>
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
                alert(JSON.stringify(await response.json()))
                throw await response.json()
              }
            }}
          />
        </div>
      ) : (
        trustees.length > 1 && (
          <table className="block w-full pb-3 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px]">
            <thead>
              <tr className="bg-[#f9f9f9] text-[11px]">
                <th>#</th>
                <th>email</th>
                <th>name</th>
                <th style={{ width: 50 }}>invite delivered</th>
                <th style={{ width: 100 }}>setup stage completed</th>
                <th>device</th>
              </tr>
            </thead>
            <tbody>
              {trustees.slice(1).map(({ device, email, mailgun_events, name, stage = 0 }, index) => (
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

                  <td style={{ fontSize: 12, textAlign: 'center' }}>{device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      {(trustees?.length || 0) > 1 && !threshold_public_key && (
        <p>
          <br />
          <i>Waiting for Privacy Protectors to complete the Pre-Election setup...</i>
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
