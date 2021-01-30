import { api } from '../../api-helper'
import { CollapsibleSection } from '../CollapsibleSection'
import { revalidate, useStored } from '../load-existing'
import { SaveButton } from '../SaveButton'
import { EncryptionAddress } from './EncryptionAddress'

export const AddTrustees = () => {
  const { election_id, threshold_public_key } = useStored()

  return (
    <CollapsibleSection subtitle="Each Trustee adds extra assurance of vote privacy." title="Trustees">
      <>
        <ol>
          <li>
            admin@secureinternetvoting.org
            <br />
            <span>The SIV server</span>
          </li>
        </ol>
        <EncryptionAddress />

        {!threshold_public_key && (
          <div>
            <a>+ Add trustees</a>
            <SaveButton
              onPress={async () => {
                const response = await api(`election/${election_id}/admin/add-trustees`, {
                  password: localStorage.password,
                  trustees: ['admin@secureinternetvoting.org'],
                })

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
        <style jsx>{`
          span {
            opacity: 0.5;
          }

          a {
            margin-left: 2.5rem;
            cursor: pointer;
          }

          div {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
        `}</style>
      </>
    </CollapsibleSection>
  )
}
