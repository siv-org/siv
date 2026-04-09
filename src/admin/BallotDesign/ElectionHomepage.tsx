import { TextField } from '@mui/material'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'

export const ElectionHomepage = () => {
  const { election_homepage: storedHomepage, election_id } = useStored()
  const [draftHomepage, setDraftHomepage] = useState<string | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  const election_homepage = draftHomepage !== undefined ? draftHomepage : (storedHomepage || '')

  return (
    <div className="mt-8 border border-solid border-gray-300 p-4 bg-[#eee]" style={{ marginTop: '20px' }}>
      <h3 className="sm:block m-0 font-normal">
        Election Homepage <span className="text-[12px] font-medium ml-1 opacity-80">(Optional)</span>
      </h3>
      <p className="text-sm text-gray-700 m-0 mb-3 mt-1">
        Set an optional link to your external election homepage or website. It will be displayed on the election status page.
      </p>

      <div className="flex items-start sm:items-center flex-col sm:flex-row gap-3">
        <TextField
          className="bg-white w-full max-w-lg"
          label="Election Homepage URL"
          onChange={(e) => setDraftHomepage(e.target.value)}
          placeholder="https://example.com"
          size="small"
          value={election_homepage}
          variant="outlined"
        />

        <div className="flex-shrink-0 self-start sm:self-auto relative bottom-[1px]">
          <SaveButton
            disabled={election_homepage === (storedHomepage || '') || saving}
            onPress={async () => {
              setSaving(true)
              const response = await api(`election/${election_id}/admin/save-election-homepage`, { election_homepage })
              if (response.status === 201) {
                revalidate(election_id)
                setDraftHomepage(undefined)
              } else {
                alert(JSON.stringify(await response.json()))
                throw await response.json()
              }
              setSaving(false)
            }}
            text={saving ? 'Saving...' : 'Save Homepage'}
          />
        </div>
      </div>
    </div>
  )
}
