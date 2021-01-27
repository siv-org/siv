import { useState } from 'react'

import { MultilineInput } from './MultilineInput'

export const AddVoters = () => {
  const [new_voters, set_new_voters] = useState('')

  return (
    <>
      <h3>Voters:</h3>
      <label>Add new voters by email address:</label>
      <MultilineInput state={new_voters} update={set_new_voters} />
    </>
  )
}