import React, { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { AddVoterTextarea } from './AddVotersTextarea'
import { CustomInvitationEditor } from './CustomInvitationEditor'
import { DuplicatesNotAdded } from './DuplicatesNotAdded'
import { ExistingVoters } from './ExistingVoters'
import { PrivacyProtectorsWarning } from './PrivacyProtectorsWarning'
import { RequestEsignatures } from './RequestEsignatures'
import { StopAcceptingVotes } from './StopAcceptingVotes'
import { ToggleShareableLink } from './ToggleShareableLink'

export const AddVoters = () => {
  const [new_voters, set_new_voters] = useState('')
  const [removedDuplicates, setRemovedDuplicates] = useState<string[]>([])
  const [invitationCollapsed, setInvitationCollapsed] = useState(false)
  const { election_id } = useStored()

  return (
    <div className="max-w-[50rem]">
      <PrivacyProtectorsWarning />
      <h2 className="hidden sm:block">Voters</h2>
      <h4>Add new voters by email address:</h4>
      <AddVoterTextarea state={new_voters} update={set_new_voters} />

      {/* Show message if duplicates were removed */}
      <DuplicatesNotAdded {...{ removedDuplicates, setRemovedDuplicates }} />

      {/* Show save button if there are new voters to add */}
      {new_voters === '' ? (
        <div style={{ height: 74 }} />
      ) : (
        <SaveButton
          onPress={async () => {
            const response = await api(`election/${election_id}/admin/add-voters`, {
              new_voters: new_voters.split('\n').map((s) => s.trim().toLowerCase()),
            })

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

      <CustomInvitationEditor
        isCollapsed={invitationCollapsed}
        onToggle={() => setInvitationCollapsed(!invitationCollapsed)}
      />

      <ToggleShareableLink />
      <RequestEsignatures />
      <StopAcceptingVotes />
      <ExistingVoters />
    </div>
  )
}
