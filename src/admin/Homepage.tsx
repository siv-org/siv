import { TextField } from '@mui/material'
import { useState } from 'react'

import { api } from '../api-helper'
import { SaveButton } from './SaveButton'
import { revalidate, useStored } from './useStored'

export const Homepage = () => {
  const { election_homepage: storedHomepage, election_id } = useStored()
  const [election_homepage, setHomepage] = useState(storedHomepage || '')
  const [saving, setSaving] = useState(false)

  return (
    <div className="container max-w-xl">
      <h2 className="sm:block">
        Election Homepage <span>(Optional)</span>
      </h2>
      <p>
        Set an optional link to your external election homepage or website. It will be displayed on the election status
        page.
      </p>

      <div className="mt-4">
        <TextField
          label="Election Homepage URL"
          onChange={(e) => setHomepage(e.target.value)}
          placeholder="https://example.com"
          size="small"
          style={{ marginTop: 10, width: '100%' }}
          value={election_homepage}
          variant="outlined"
        />
      </div>

      <div className="mt-6">
        <SaveButton
          disabled={election_homepage === (storedHomepage || '') || saving}
          onPress={async () => {
            setSaving(true)
            const response = await api(`election/${election_id}/admin/save-election-homepage`, { election_homepage })
            if (response.status === 201) {
              revalidate(election_id)
            } else {
              alert(JSON.stringify(await response.json()))
              throw await response.json()
            }
            setSaving(false)
          }}
          text={saving ? 'Saving...' : 'Save Homepage'}
        />
      </div>
      <style jsx>{`
        h2 span {
          font-size: 12px;
          font-weight: 500;
          margin-left: 5px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}
