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

        const voters_selected = checked.reduce((acc: { email: string; hasVoted: boolean }[], is_checked, index) => {
          if (is_checked)
            acc.push({
              email: valid_voters[index].email,
              hasVoted: valid_voters[index].has_voted,
            })
          return acc
        }, [])

        const hasVotedMsg =
          'Are you sure you want to invalidate this voter & their submitted vote? ' +
          'The public will be able to see the vote was invalidated (but not its contents).'
        const noVoteMsg = 'Are you sure you want to invalidate this voter & their auth token?'
        const confirmed = confirm(
          voters_selected.map((voter) => (voter.hasVoted ? hasVotedMsg : noVoteMsg)).join('\n\n'),
        )

        if (!confirmed) return

        const response = await api(`election/${election_id}/admin/invalidate-voters`, {
          voters: voters_selected.map((voter) => voter.email),
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
