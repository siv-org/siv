import { useState } from 'react'

import { api } from '../../api-helper'
import { CollapsibleSection } from '../CollapsibleSection'
import { revalidate, useStored } from '../load-existing'
import { SaveButton } from '../SaveButton'
import { ExistingVoters } from './ExistingVoters'
import { MultilineInput } from './MultilineInput'

export const AddVoters = () => {
  const [new_voters, set_new_voters] = useState('')
  const { election_id } = useStored()

  return (
    <CollapsibleSection subtitle="Add new voters by email address:" title="Voters">
      <>
        <MultilineInput state={new_voters} update={set_new_voters} />

        {/* Show save button if there are new voters to add */}
        {new_voters === '' ? (
          <div style={{ height: 74 }} />
        ) : (
          <SaveButton
            onPress={async () => {
              const response = await api(`election/${election_id}/admin/add-voters`, {
                new_voters: new_voters.split('\n'),
                password: localStorage.password,
              })

              if (response.status === 201) {
                revalidate(election_id)
                set_new_voters('')
              } else {
                throw await response.json()
              }
            }}
          />
        )}
        <ExistingVoters />
      </>
    </CollapsibleSection>
  )
}
