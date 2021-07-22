import { TextField } from '@material-ui/core'
import EmailValidator from 'email-validator'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
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
      <ol>
        <li>
          {admin_email}
          <br />
          <span>The SIV server</span>
        </li>
        {trustees?.slice(1).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
      {!trustees?.length && (
        <div>
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

        span {
          opacity: 0.5;
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
          opacity: 1;
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
      `}</style>
    </div>
  )
}
