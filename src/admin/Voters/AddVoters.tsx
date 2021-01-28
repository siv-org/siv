import { useState } from 'react'

import { CollapsibleSection } from '../CollapsibleSection'
import { ExistingVoters } from './ExistingVoters'
import { MultilineInput } from './MultilineInput'

export const AddVoters = () => {
  const [new_voters, set_new_voters] = useState('')

  return (
    <CollapsibleSection subtitle="Add new voters by email address:" title="Voters">
      <MultilineInput state={new_voters} update={set_new_voters} />
      <ExistingVoters />
    </CollapsibleSection>
  )
}
