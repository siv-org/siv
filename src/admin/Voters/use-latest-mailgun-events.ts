import { Voter } from 'pages/api/election/[election_id]/admin/load-admin'
import { useEffect, useRef } from 'react'
import { api } from 'src/api-helper'

import { revalidate } from '../useStored'

/** Auto run api/check-voter-invite-status when there are pending invites */
export const use_latest_mailgun_events = (
  election_id: string | undefined,
  voters: undefined | Voter[],
  election_manager?: string,
) => {
  const num_invited = voters?.reduce(
    (acc: { delivered: number; failed: number; queued: number }, voter) => {
      if (voter.invite_queued) acc.queued += voter.invite_queued.length
      if (voter.mailgun_events?.delivered) acc.delivered += voter.mailgun_events.delivered.length
      if (voter.mailgun_events?.failed) acc.failed += voter.mailgun_events.failed.length
      return acc
    },
    { delivered: 0, failed: 0, queued: 0 },
  )
  const pending_invites = num_invited && num_invited.queued > num_invited.delivered + num_invited.failed
  const last_num_events_ref = useRef(0)
  useEffect(() => {
    if (election_manager === 'SIV End2End Tester') return

    if (pending_invites && election_id) {
      const interval = setInterval(() => {
        console.log('Checking pending invites...')
        api(`election/${election_id}/admin/check-voter-invite-status`)
          .then((response) => response.json())
          .then(({ num_events }: { num_events: number }) => {
            if (num_events !== last_num_events_ref.current) {
              revalidate(election_id)
              last_num_events_ref.current = num_events
            }
          })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [pending_invites, election_id, election_manager])
}
