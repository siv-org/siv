import { VoterInvites } from 'api/election/[election_id]/admin/find-voter-invites'
import { useRouter } from 'next/router'
import { useData } from 'src/pusher-helper'

export function useVoterInvites(): VoterInvites {
  const election_id = useRouter().query.election_id as string | undefined

  const { data } = useData(`election/${election_id}/admin/find-voter-invites`, [
    `invite-voter-${election_id}`,
    'delivery',
  ])
  return data || {}
}
