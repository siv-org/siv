import { TextField } from '@mui/material'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'

const getValidUrl = (urlString?: string): null | string => {
  if (!urlString) return ''

  const trimmed = urlString.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    return ['http:', 'https:'].includes(parsed.protocol)
      ? parsed.href
      : null
  } catch {
    return null
  }
}

export const ElectionHomepage = () => {
  const { election_homepage: storedHomepage, election_id } = useStored()
  const [draftHomepage, setDraftHomepage] = useState<string | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [errorString, setErrorString] = useState('')

  const election_homepage = draftHomepage !== undefined ? draftHomepage : (storedHomepage || '')

  return (
    <div className="flex-1 border border-solid border-gray-300 text-gray-700 p-2.5 bg-[#eee] mt-[29px]">
      <div className="p-2.5 bg-white">
        <label className="block text-[14px] font-semibold mb-[2px]">
          Election Homepage URL <span className="opacity-80 font-normal text-[11px] ml-0.5">(Optional)</span>
        </label>
        
        <p className="text-[12px] italic opacity-80 m-0 mb-1">
          Set an optional link to your external election homepage. It will be displayed on the election status page.
        </p>

        <div className="flex items-center gap-3">
          <TextField
            className="bg-white w-full max-w-4xl"
            error={!!errorString}
            helperText={errorString}
            onChange={(e) => {
              setDraftHomepage(e.target.value)
              setErrorString('')
            }}
            placeholder="https://example.com"
            size="small"
            value={election_homepage}
            variant="outlined"
          /> 

          <div className="flex-shrink-0 relative bottom-[1px]">
            <SaveButton
              disabled={!!errorString || election_homepage === (storedHomepage || '') || saving}
              onPress={async () => {
                const finalUrl = getValidUrl(election_homepage)
                if (finalUrl === null) {
                  return setErrorString('Please enter a valid URL (e.g. https://example.com)')
                }
                setSaving(true)
                const response = await api(`election/${election_id}/admin/save-election-homepage`, { election_homepage: finalUrl })
                setSaving(false)

                if (response.status === 201) {
                  revalidate(election_id)
                  setDraftHomepage(undefined)
                } else {
                  const data = await response.json()
                  setErrorString(data.error || 'An error occurred while saving')
                }
              }}
              text={saving ? 'Saving...' : 'Save Homepage'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
