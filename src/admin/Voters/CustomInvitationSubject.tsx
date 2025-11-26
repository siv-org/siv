import { useState } from 'react'

import { useStored } from '../useStored'

export const CustomInvitationSubject = () => {
  const { custom_invite_subject = 'Vote Invitation' } = useStored()
  const [subject, setSubject] = useState(custom_invite_subject)

  return (
    <div
      className="p-2 mb-1 rounded cursor-pointer hover:bg-gray-100"
      onClick={() => {
        const newSubject = prompt('Modify email subject:', subject)
        if (newSubject) setSubject(newSubject)
      }}
    >
      <span className="opacity-50">Email subject:</span> {subject}
    </div>
  )
}
