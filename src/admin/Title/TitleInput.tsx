import { useState } from 'react'

import { api } from '../../api-helper'
import { StageAndSetter } from '../AdminPage'
import { revalidate } from '../load-existing'
import { SaveButton } from '../SaveButton'

export const TitleInput = ({ set_stage, stage }: StageAndSetter) => {
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
      {stage === 0 && (
        <SaveButton
          id="election-title-save"
          onPress={async () => {
            const response = await api('create-election', { election_title, password: localStorage.password })
            revalidate()

            if (response.status === 201) {
              const { election_id } = await response.json()

              // Set election_id in URL
              const url = new URL(window.location.toString())
              url.searchParams.set('election_id', election_id)
              window.history.pushState({}, '', url.toString())

              set_stage(stage + 1)
            } else {
              throw await response.json()
            }
          }}
        />
      )}

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
