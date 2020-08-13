import { useState } from 'react'

import { api } from '../api-helper'
import { public_key } from '../protocol/election-parameters'
import { AddGroup } from './AddGroup'

export const AddParticipants = () => {
  const [pubKey, setPubKey] = useState(false)
  const [sentVotersInvite, setSentVotersInvite] = useState(false)

  return (
    <div>
      <AddGroup
        disabled={pubKey}
        message={`Trustees made pub key ${public_key.recipient.toString()}`}
        onClick={() => {
          setPubKey(true)
          return true
        }}
        type="trustees"
      />
      <AddGroup
        disabled={!pubKey || sentVotersInvite}
        message={!pubKey ? 'Waiting on Trustees' : ''}
        onClick={async () => {
          // Grab voters from textarea
          const voters = (document.getElementById('voters-input') as HTMLInputElement).value
            .split('\n')
            .filter((v) => v !== '')

          // Call backend endpoint
          const { status } = await api('invite-voters', { password: localStorage.password, voters })

          // Success case
          if (status === 200) {
            setSentVotersInvite(true)
            return true
          }

          // Need to reset password
          if (status === 401) {
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
