import { useState } from 'react'

import { api } from '../api-helper'
import { public_key } from '../protocol/election-parameters'
import { AddGroup } from './AddGroup'

export const AddParticipants = () => {
  const [pubKey, setPubKey] = useState(false)
  const [election_id, setElectionID] = useState<string>()

  return (
    <div>
      <AddGroup
        defaultValue="admin@secureinternetvoting.org&#13;&#10;"
        disabled={pubKey}
        message={`Trustees made pub key ${public_key.recipient.toString()}`}
        onClick={() => {
          setPubKey(true)
          return true
        }}
        type="trustees"
      />
      <AddGroup
        disabled={!pubKey || !!election_id}
        message={!pubKey ? 'Waiting on Trustees' : !election_id ? '' : `Created election ${election_id}`}
        onClick={async () => {
          // Grab voters from textarea
          const voters = (document.getElementById('voters-input') as HTMLInputElement).value
            .split('\n')
            .filter((v) => v !== '')

          // Call backend endpoint
          const response = await api('invite-voters', { password: localStorage.password, voters })

          // Success case
          if (response.status === 201) {
            setElectionID(await response.text())

            return true
          }

          // Need to reset password
          if (response.status === 401) {
            localStorage.removeItem('password')
            alert('Invalid Password')
          }
          return false
        }}
        type="voters"
      />
      <style jsx>{`
        div {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  )
}
