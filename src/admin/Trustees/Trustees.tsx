import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { MultilineInput } from '../Voters/MultilineInput'
import { EncryptionAddress } from './EncryptionAddress'

export const Trustees = () => {
  const { election_id, threshold_public_key, trustees } = useStored()
  const [new_trustees, set_new_trustees] = useState('')

  const admin_email = 'admin@secureinternetvoting.org'

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
          <MultilineInput
            placeholder="additional_trustee@email.com"
            startAt={2}
            state={new_trustees}
            update={set_new_trustees}
          />
          <SaveButton
            text={!new_trustees.length ? 'Skip' : 'Save'}
            onPress={async () => {
              const trustees = [
                admin_email,
                ...new_trustees
                  .split('\n')
                  .map((s) => s.trim().toLowerCase())
                  .filter((s) => s), // Remove blanks
              ]

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
      `}</style>
    </div>
  )
}
