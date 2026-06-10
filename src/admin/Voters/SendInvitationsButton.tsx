import { MailOutlined } from '@ant-design/icons'
import { useReducer } from 'react'
import { api } from 'src/api-helper'
import throat from 'throat'

import { OnClickButton } from '../../_shared/Button'
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
  const { ballot_design_finalized, election_id, threshold_public_key, valid_voters } = useStored()
  const [sending, toggle_sending] = useReducer((state) => !state, false)

  if (!valid_voters) return null

  return (
    <OnClickButton
      className="bg-white"
      disabled={!num_checked}
      onClick={async () => {
        if (!ballot_design_finalized) return alert('You need to Finalize a Ballot Design first.')
        if (!threshold_public_key) return alert('You need to finish setting the election Privacy Protectors first.')

        const voters_to_invite = checked.reduce((acc: string[], is_checked, index) => {
          if (is_checked) acc.push(valid_voters[index].email)
          return acc
        }, [])

        // Warn if any selected voters have already cast a vote (e.g. accidentally selected while hidden)
        const already_voted = checked.reduce((acc: string[], is_checked, index) => {
          if (is_checked && valid_voters[index].has_voted) acc.push(valid_voters[index].email)
          return acc
        }, [])
        if (already_voted.length) {
          const preview = already_voted.slice(0, 5).join(', ')
          const more = already_voted.length > 5 ? `, and ${already_voted.length - 5} more` : ''
          const warning =
            `Heads up: ${already_voted.length} of the selected voter${already_voted.length === 1 ? ' has' : 's have'} ` +
            `already cast a vote (${preview}${more}).\n\nAre you sure you want to send them another invitation?`
          if (!confirm(warning)) return
        }

        toggle_sending()

        // Revalidate every second
        const revalidate_interval = setInterval(() => revalidate(election_id), 1000)

        // Split the recipients into chunks
        const chunk_size = 10
        const chunks: string[][] = []
        for (let i = 0; i < voters_to_invite.length; i += chunk_size) {
          chunks.push(voters_to_invite.slice(i, i + chunk_size))
        }

        try {
          // Send one chunk at a time
          await Promise.all(
            chunks.map(
              throat(1, async (chunk, index) => {
                // console.log('Starting chunk', index)
                const response = await api(`election/${election_id}/admin/invite-voters`, { voters: chunk })
                // console.log('Got response to chunk', index)
                if (response.status !== 201) {
                  const json = await response.json()
                  console.error('Send Invitation error:', json)
                  set_error(json?.error || `Error w/o message, in chunk ${index}`)
                }
              }),
            ),
          )
        } catch (e) {
          if (e instanceof Error) set_error(e.message)
          set_error('Caught error w/o message')
        }

        clearInterval(revalidate_interval)
        toggle_sending()
      }}
      style={{ margin: 0, padding: '5px 10px' }}
    >
      <>
        {sending && <Spinner />}
        <MailOutlined />
        &nbsp; Send{sending ? 'ing' : ''} {num_checked} Invitation{num_checked === 1 ? '' : 's'}
      </>
    </OnClickButton>
  )
}
