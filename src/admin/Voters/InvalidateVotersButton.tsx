import { DeleteOutlined } from '@ant-design/icons'
import { api } from 'src/api-helper'
import { useWindowDimensions } from 'src/protocol/useWindowDimensions'

import { OnClickButton } from '../../_shared/Button'
import { revalidate, useStored } from '../useStored'

export const InvalidateVotersButton = ({
  checked,
  displayOnly,
  num_checked,
  set_error,
}: {
  checked: boolean[]
  displayOnly?: boolean
  num_checked: number
  set_error: (error: string) => void
}) => {
  const { election_id, valid_voters = [] } = useStored()
  const { width } = useWindowDimensions()

  return (
    <OnClickButton
      disabled={!displayOnly && !num_checked}
      style={{
        alignSelf: 'flex-start',
        borderWidth: 1,
        margin: 0,
        marginLeft: width < 400 ? 0 : num_checked === 1 ? 15 : 5,
        marginTop: width < 400 ? 3 : 0,
        padding: '5px 10px',
      }}
      onClick={async () => {
        if (displayOnly) return

        const voters_selected = checked.reduce(
          (acc: { auth_token: string; email: string; hasVoted: boolean }[], is_checked, index) => {
            if (is_checked)
              acc.push({
                auth_token: valid_voters[index].auth_token,
                email: valid_voters[index].email,
                hasVoted: valid_voters[index].has_voted,
              })
            return acc
          },
          [],
        )

        const votersWhoVoted = voters_selected.filter((voter) => voter.hasVoted)
        const votersWhoDidNotVote = voters_selected.filter((voter) => !voter.hasVoted)

        let message = ''
        if (votersWhoVoted.length > 0) {
          message += `Are you sure you want to invalidate ${
            votersWhoVoted.length === 1 ? 'this voter' : `these ${votersWhoVoted.length} voters`
          } & their submitted vote${votersWhoVoted.length === 1 ? '' : 's'}? The public will be able to see the vote${
            votersWhoVoted.length === 1 ? ' was' : 's were'
          } invalidated, but not the vote content.\n\nVoters with votes:\n${votersWhoVoted
            .map((voter) => `- ${voter.email}`)
            .join('\n')}`
        }

        if (votersWhoVoted.length > 0 && votersWhoDidNotVote.length > 0) {
          message += '\n\n————————————\n\n'
        }

        if (votersWhoDidNotVote.length > 0) {
          message += `Are you sure you want to invalidate ${
            votersWhoDidNotVote.length === 1 ? 'this voter' : `these ${votersWhoDidNotVote.length} voters`
          } & their auth token${
            votersWhoDidNotVote.length === 1 ? '' : 's'
          }?\n\nVoters without votes:\n${votersWhoDidNotVote.map((voter) => `- ${voter.email}`).join('\n')}`
        }

        const confirmed = confirm(message)

        if (!confirmed) return

        const response = await api(`election/${election_id}/admin/invalidate-voters`, {
          voters_to_invalidate: voters_selected,
        })

        try {
          if (response.status === 201) {
            revalidate(election_id)
          } else {
            const json = await response.json()
            console.error(json)
            set_error(json?.error || 'Error w/o message ')
          }
        } catch (e) {
          if (e instanceof Error) set_error(e.message)
          set_error('Caught error w/o message')
        }
      }}
    >
      <DeleteOutlined />
    </OnClickButton>
  )
}
