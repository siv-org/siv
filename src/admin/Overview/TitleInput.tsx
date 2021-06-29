import router from 'next/router'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'

export const TitleInput = () => {
  const [election_title, set_title] = useState('')

  return (
    <>
      <input
        id="election-title"
        placeholder="Give your election a name your voters will recognize"
        value={election_title}
        onChange={(event) => set_title(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            document.getElementById('election-title')?.blur()
            document.getElementById('election-title-save')?.click()
          }
        }}
      />
      <SaveButton
        id="election-title-save"
        onPress={async () => {
          const response = await api('create-election', { election_title })

          if (response.status === 201) {
            const { election_id } = await response.json()

            // Set election_id in URL
            router.push(`${window.location.origin}/admin/${election_id}/trustees`)
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
