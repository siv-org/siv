import router from 'next/router'
import { useRef, useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'

export const CreateNewConvention = () => {
  const [convention_title, set_title] = useState('')
  const $input = useRef<HTMLInputElement>(null)
  const $saveBtn = useRef<HTMLAnchorElement>(null)

  return (
    <>
      <h2>Create New Convention</h2>
      <label>Convention Title:</label>

      <input
        className="w-full p-2 text-sm border border-gray-300 border-solid rounded"
        placeholder="Give your convention a name you will recognize"
        ref={$input}
        value={convention_title}
        onChange={(event) => set_title(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            $input.current?.blur()
            $saveBtn.current?.click()
          }
        }}
      />
      <SaveButton
        ref={$saveBtn}
        onPress={async () => {
          const response = await api('create-creation', { convention_title })
          if (response.status !== 201) throw await response.json()

          // Set convention_id in URL
          const { convention_id } = await response.json()
          router.push(`${window.location.origin}/admin/conventions/${convention_id}/ballot-design`)
        }}
      />
    </>
  )
}
