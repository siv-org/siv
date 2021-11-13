import { Trustee } from 'pages/api/election/[election_id]/admin/load-admin'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

import { revalidate } from '../useStored'

export const useLatestMailgunEvents = (election_id: string | undefined, trustees: Trustee[] | undefined) => {
  // Auto run api/check-trustee-invite-status when there are pending invites
  const num_invited = trustees?.reduce(
    (acc: { delivered: number; failed: number }, trustee) => {
      if (trustee.mailgun_events?.delivered) acc.delivered += trustee.mailgun_events.delivered.length
      if (trustee.mailgun_events?.failed) acc.failed += trustee.mailgun_events.failed.length
      return acc
    },
    { delivered: 0, failed: 0 },
  )
  const pending_invites = trustees && num_invited && trustees.length > num_invited.delivered + num_invited.failed + 1 // +1 for admin@
  const [last_num_events, set_last_num_events] = useState(0)
  useEffect(() => {
    if (pending_invites) {
      const interval = setInterval(() => {
        console.log('Checking pending invites...')
        api(`election/${election_id}/admin/check-trustee-invite-status`)
          .then((response) => response.json())
          .then(({ num_events }) => {
            if (num_events !== last_num_events) {
              revalidate(election_id)
              set_last_num_events(num_events)
            }
          })
      }, 1000)
      return () => {
        console.log('All invites delivered 👍')
        clearInterval(interval)
      }
    }
  }, [pending_invites])
}
