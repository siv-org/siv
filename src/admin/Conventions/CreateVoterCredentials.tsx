import { useRef, useState } from 'react'
import { api } from 'src/api-helper'

import { SaveButton } from './SaveButton'
import { revalidate } from './useConventionInfo'

export const CreateVoterCredentials = ({ convention_id }: { convention_id: string }) => {
  const [numQRs, setNumQRs] = useState<string>('')
  const $saveBtn = useRef<HTMLAnchorElement>(null)

  return (
    <div>
      <label>Create how many voter QR credentials?</label>

      <input
        className="w-20 ml-3 text-lg"
        min="1"
        onChange={(e) => setNumQRs(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
            $saveBtn.current?.click()
          }
        }}
        placeholder="150"
        type="number"
        value={numQRs}
      />

      <SaveButton
        disabled={!numQRs}
        onPress={async () => {
          await api(`/conventions/${convention_id}/create-qrs`, { numQRs: Number(numQRs) })
          revalidate(convention_id)
          setNumQRs('')
        }}
        ref={$saveBtn}
        text="Create"
      />
    </div>
  )
}
