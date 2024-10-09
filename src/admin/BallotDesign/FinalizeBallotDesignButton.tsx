import router from 'next/router'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate } from '../useStored'
import { check_for_less_urgent_ballot_errors } from './check_for_ballot_errors'

export const FinalizeBallotDesignButton = ({
  design,
  election_id,
  error,
  set_saving_errors,
}: {
  design: string
  election_id?: string
  error: string | null
  set_saving_errors: (error: string) => void
}) => {
  return (
    <SaveButton
      disabled={!!error}
      text={error ? 'Error!' : 'Finalize'}
      onPress={async () => {
        const error = check_for_less_urgent_ballot_errors(design)
        if (error) return set_saving_errors(error)

        const response = await api(`election/${election_id}/admin/finalize-ballot-design`)
        if (response.status !== 201) return alert(JSON.stringify(await response.json()))

        revalidate(election_id)
        router.push(`${window.location.origin}/admin/${election_id}/privacy`)
      }}
    />
  )
}
