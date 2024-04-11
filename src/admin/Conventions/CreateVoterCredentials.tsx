import { useRef, useState } from 'react'
import { api } from 'src/api-helper'

import { SaveButton } from './SaveButton'
import { revalidate } from './useConventionInfo'

export const CreateVoterCredentials = ({ convention_id }: { convention_id: string }) => {
  const [numVoters, setNumVoters] = useState<string>('')
  const $saveBtn = useRef<HTMLAnchorElement>(null)

  return (
    <div>
      <label>Create how many voter credentials?</label>

      <input
        className="w-20 ml-3 text-lg"
        min="1"
        placeholder="150"
        type="number"
        value={numVoters}
        onChange={(e) => setNumVoters(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
            $saveBtn.current?.click()
          }
        }}
      />

      <SaveButton
        disabled={!numVoters}
        ref={$saveBtn}
        text="Create"
        onPress={async () => {
          await api(`/conventions/${convention_id}/add-voters`, { numVoters: Number(numVoters) })
          revalidate(convention_id)
          setNumVoters('')
        }}
      />
    </div>
  )
}
