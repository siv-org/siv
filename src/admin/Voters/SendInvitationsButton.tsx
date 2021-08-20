import { MailOutlined } from '@ant-design/icons'
import { useReducer } from 'react'
import { api } from 'src/api-helper'

import { OnClickButton } from '../../landing-page/Button'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const SendInvitationsButton = ({
  checked,
  num_checked,
  set_error,
}: {
  checked: boolean[]
  num_checked: number
  set_error: (error: string) => void
}) => {
  const { ballot_design_finalized, election_id, threshold_public_key, voters } = useStored()
  const [sending, toggle_sending] = useReducer((state) => !state, false)

  if (!voters) return null

  return (
    <OnClickButton
      disabled={!num_checked}
      style={{ margin: 0, padding: '5px 10px' }}
      onClick={async () => {
        if (!ballot_design_finalized) return alert('You need to Finalize a Ballot Design first.')
        if (!threshold_public_key) return alert('You need to finish setting the election Observers first.')

        toggle_sending()
        const voters_to_invite = checked.reduce((acc: string[], is_checked, index) => {
          if (is_checked) acc.push(voters[index].email)
          return acc
        }, [])

        try {
          const response = await api(`election/${election_id}/admin/invite-voters`, {
            voters: voters_to_invite,
          })

          if (response.status === 201) {
            revalidate(election_id)
          } else {
            const json = await response.json()
            console.error(json)
            set_error(json?.error || 'Error w/o message ')
          }
        } catch (e) {
          set_error(e.message || 'Caught error w/o message')
        }

        toggle_sending()
      }}
    >
      <>
        {sending && <Spinner />}
        <MailOutlined />
        &nbsp; Send{sending ? 'ing' : ''} {num_checked} Invitation{num_checked === 1 ? '' : 's'}
      </>
    </OnClickButton>
  )
}
