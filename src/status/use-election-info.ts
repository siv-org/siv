import { ElectionInfo } from '../../pages/api/election/[election_id]/info'
import { useData } from '../pusher-helper'
import { useElectionId } from './use-election-id'

export function useElectionInfo(): ElectionInfo {
  const e_id = useElectionId()

  const data = useData(`election/${e_id}/info`, [e_id, 'decrypted'])

  return !data ? {} : data
}
