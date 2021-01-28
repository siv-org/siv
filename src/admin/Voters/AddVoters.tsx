import { useState } from 'react'

import { api } from '../../api-helper'
import { CollapsibleSection } from '../CollapsibleSection'
import { useElectionID } from '../ElectionID'
import { revalidate } from '../load-existing'
import { SaveButton } from '../SaveButton'
import { ExistingVoters } from './ExistingVoters'
import { MultilineInput } from './MultilineInput'

export const AddVoters = () => {
  const [new_voters, set_new_voters] = useState('')
  const election_id = useElectionID()

  return (
    <CollapsibleSection subtitle="Add new voters by email address:" title="Voters">
      <>
        <MultilineInput state={new_voters} update={set_new_voters} />
        {new_voters !== '' && (
          <SaveButton
            onPress={async () => {
              const response = await api(`election/${election_id}/add-voters`, {
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
