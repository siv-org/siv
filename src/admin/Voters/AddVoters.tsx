import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { AddVoterTextarea } from './AddVotersTextarea'
import { CustomEmailHeaderbar } from './CustomEmailHeaderbar'
import { CustomInvitationEditor } from './CustomInvitationEditor'
import { DuplicatesNotAdded } from './DuplicatesNotAdded'
import { ExistingVoters } from './ExistingVoters'
import { PrivacyProtectorsWarning } from './PrivacyProtectorsWarning'
import { PublishWhosVoted } from './PublishWhosVoted'
import { RequestEsignatures } from './RequestEsignatures'
import { StopAcceptingVotes } from './StopAcceptingVotes'
import { ToggleShareableLink } from './ToggleShareableLink'
import { UploadVoterRollPanel } from './UploadVoterRollPanel'
import { VoterRollUploadsTable } from './VoterRollUploadsTable'

export const AddVoters = () => {
  const [new_voters, set_new_voters] = useState('')
  const [removedDuplicates, setRemovedDuplicates] = useState<string[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const { election_id } = useStored()

  return (
    <div className="max-w-[50rem]">
      <PrivacyProtectorsWarning />
      <h2 className="hidden sm:block">Voters</h2>
      <h4>Add new voters by email address:</h4>
      <AddVoterTextarea state={new_voters} update={set_new_voters} />

      {/* Row for Upload & Save */}
      <div className="flex gap-3 justify-between items-center min-h-[74px]">
        {/* Upload button */}
        <button
          className="inline-flex gap-1.5 items-center px-3 py-1 relative bottom-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 border-solid rounded-md cursor-pointer transition-colors hover:text-gray-900 hover:bg-gray-100"
          onClick={() => setShowUpload((v) => !v)}
          type="button"
        >
          <UploadOutlined />
          {showUpload ? 'Hide upload' : 'Or upload'}
        </button>

        {/* Save button, if voters added */}
        {new_voters !== '' && (
          <SaveButton
            onPress={async () => {
              const response = await api(`election/${election_id}/admin/add-voters`, { new_voters })

              if (response.status === 201) {
                const data = await response.json()
                setRemovedDuplicates(data.all_duplicates)
                revalidate(election_id)
                set_new_voters('')
              } else {
                throw await response.json()
              }
            }}
          />
        )}
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="-mt-3 mb-4">
          <UploadVoterRollPanel election_id={election_id} />
        </div>
      )}

      <VoterRollUploadsTable />

      {/* Show message if duplicates were removed */}
      <DuplicatesNotAdded {...{ removedDuplicates, setRemovedDuplicates }} />

      <CustomEmailHeaderbar />
      <CustomInvitationEditor />

      <ToggleShareableLink />
      <RequestEsignatures />
      <StopAcceptingVotes />
      <PublishWhosVoted />
      <ExistingVoters />
    </div>
  )
}
