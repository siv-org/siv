import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { AddGroup } from './AddGroup'
import { initPusher } from './pusher-helper'

export const AddParticipants = () => {
  const [closed, setClosed] = useState(false)
  const [pub_key, setPubKey] = useState<string>()
  const [voted, setVoted] = useState<boolean[]>([])
  const [election_id, setElectionID] = useState<string>()

  // Subscribe to updates
  initPusher({ election_id, setPubKey, setVoted })

  return (
    <>
      <div>
        <AddGroup
          defaultValue="admin@secureinternetvoting.org&#13;&#10;"
          disabled={!!election_id}
          message={!pub_key ? 'Trustees invited to create public threshold key' : `Trustees made pub key ${pub_key}`}
          type="trustees"
          onSubmit={async () => {
            // Grab trustees from textarea
            const trustees = (document.getElementById('trustees-input') as HTMLInputElement).value
              .split('\n')
              .filter((v) => v !== '')

            // Call backend endpoint
            const response = await api('invite-trustees', { password: localStorage.password, trustees })

            // Success case
            if (response.status === 201) {
              const { election_id, threshold_public_key } = await response.json()

              setElectionID(election_id)

              if (threshold_public_key) {
                setPubKey(threshold_public_key)
              }
              return true
            }

            // Reset password if incorrect
            if (response.status === 401) {
              localStorage.removeItem('password')
              alert('Invalid Password')
            }
            return false
          }}
        />
        <AddGroup
          disabled={!pub_key}
          message={!pub_key ? 'Waiting on Trustees' : !election_id ? '' : `Created election ${election_id}`}
          type="voters"
          voted={voted}
          onSubmit={async () => {
            // Grab voters from textarea
            const voters = (document.getElementById('voters-input') as HTMLInputElement).value
              .split('\n')
              .filter((v) => v !== '')

            // Grab ballot design from textarea
            const ballot_design = (document.getElementById('ballot-design') as HTMLInputElement).value
              .replace(/\n/g, '') // remove new lines
              .replace(/ {2,}/, ' ') // remove extra spaces

            // Call backend endpoint
            const response = await api(`invite-voters`, {
              ballot_design,
              election_id,
              password: localStorage.password,
              voters,
            })

            // Success case
            if (response.status === 201) {
              return true
            }

            // Reset password if incorrect
            if (response.status === 401) {
              localStorage.removeItem('password')
              alert('Invalid Password')
            }
            return false
          }}
        />
      </div>
      {election_id && (
        <OnClickButton
          style={{ float: 'right', marginRight: 0, padding: '8px 17px' }}
          onClick={async () => {
            const { status } = await api(`election/${election_id}/close?password=${localStorage.password}`)
            if (status === 201) setClosed(true)
          }}
        >
          {!closed ? `Close Election` : `Election Closed.`}
        </OnClickButton>
      )}

      <style jsx>{`
        div {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
      `}</style>
    </>
  )
}
