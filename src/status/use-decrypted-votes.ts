import { useData } from '../pusher-helper'
import { useElectionId } from './use-election-id'

type Votes = Record<string, string>[]

export const useDecryptedVotes = (): Votes => {
  const e_id = useElectionId()

  return useData(`election/${e_id}/decrypted-votes`, [e_id, 'decrypted'])
}
