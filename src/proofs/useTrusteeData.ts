import { TrusteesLatest } from '../../pages/api/election/[election_id]/trustees/latest'
import { useData } from '../pusher-helper'
import { useElectionId } from '../status/use-election-id'

export function useTrusteeData() {
  const e_id = useElectionId()

  const { data } = useData(`election/${e_id}/trustees/latest`)
  const typedData = data as TrusteesLatest | undefined
  return typedData || { t: undefined, trustees: undefined }
}
