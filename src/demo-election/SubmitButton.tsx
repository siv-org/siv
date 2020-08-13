import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = ({
  authToken,
  electionId,
  encryptedString,
}: {
  authToken?: string
  electionId?: string
  encryptedString: string
}) => {
  return (
    <div>
      <OnClickButton onClick={() => api('submit-vote', { authToken, electionId, encryptedString })}>
        Submit
      </OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
