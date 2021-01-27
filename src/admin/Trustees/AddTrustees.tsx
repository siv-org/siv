import { api } from '../../api-helper'
import { StageAndSetter } from '../AdminPage'
import { useElectionID } from '../ElectionID'
import { revalidate } from '../load-existing'
import { SaveButton } from '../SaveButton'
import { EncryptionAddress } from './EncryptionAddress'

export const AddTrustees = ({ stage }: StageAndSetter) => {
  const election_id = useElectionID()

  return (
    <>
      <h3>Trustees:</h3>
      <label>Each Trustee adds extra assurance of vote privacy.</label>
      <ol>
        <li>
          admin@secureinternetvoting.org
          <br />
          <span>The SIV server</span>
        </li>
      </ol>
      <EncryptionAddress />

      {stage === 1 && (
        <div>
          <a>+ Add trustees</a>
          <SaveButton
            onPress={async () => {
              const response = await api(`election/${election_id}/add-trustees`, {
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
        label {
          opacity: 0.5;
        }

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
  )
}
