import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'

export const ManagerInput = () => {
  const { election_id } = useStored()
  const [election_manager, set_manager] = useState('')

  return (
    <>
      <input
        id="election-manager"
        placeholder="Who's responsible for running the election?"
        value={election_manager}
        onChange={(event) => set_manager(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            document.getElementById('election-manager')?.blur()
            document.getElementById('election-manager-save')?.click()
          }
        }}
      />
      <SaveButton
        id="election-manager-save"
        onPress={async () => {
          const response = await api(`election/${election_id}/admin/save-election-manager`, {
            election_manager,
            password: localStorage.password,
          })

          if (response.status === 201) {
            revalidate(election_id)
          } else {
            throw await response.json()
          }
        }}
      />

      <style jsx>{`
        input {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          padding: 8px;
          width: 100%;
        }
      `}</style>
    </>
  )
}
