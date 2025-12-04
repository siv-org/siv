import { api } from 'src/api-helper'

import { revalidate, useStored } from '../useStored'

export const CustomInvitationSubject = () => {
  const { custom_invitation_subject = 'Loading...', election_id } = useStored()

  return (
    <div
      className="p-2 mb-1 rounded cursor-pointer hover:bg-gray-100"
      onClick={async () => {
        const newSubject = prompt('Modify email subject:', custom_invitation_subject)
        if (!newSubject) return

        await api(`election/${election_id}/admin/update-invitation-subject`, {
          custom_invitation_subject: newSubject,
        })
        revalidate(election_id)
      }}
    >
      <span className="opacity-50">Email subject:</span> {custom_invitation_subject}
    </div>
  )
}
