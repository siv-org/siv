import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { public_key } from '../protocol/election-parameters'
import { AddGroup } from './AddGroup'

export const AddParticipants = () => {
  const [closed, setClosed] = useState(false)
  const [pubKey, setPubKey] = useState(false)
  const [election_id, setElectionID] = useState<string>()

  return (
    <>
      <div>
        <AddGroup
          defaultValue="admin@secureinternetvoting.org&#13;&#10;"
          disabled={pubKey}
          message={`Trustees made pub key ${public_key.recipient.toString()}`}
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
              setElectionID(await response.text())

              setPubKey(true)
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
          disabled={!pubKey || !!election_id}
          message={!pubKey ? 'Waiting on Trustees' : !election_id ? '' : `Created election ${election_id}`}
          statusURL={
            election_id ? `api/election/${election_id}/has-submitted-vote?password=${localStorage.password}` : undefined
          }
          type="voters"
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
