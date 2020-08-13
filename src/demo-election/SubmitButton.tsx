import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = ({
  authToken,
  disabled,
  electionId,
  encryptedString,
}: {
  authToken?: string
  disabled?: boolean
  electionId?: string
  encryptedString: string
}) => {
  return (
    <div>
      <OnClickButton {...{ disabled }} onClick={() => api('submit-vote', { authToken, electionId, encryptedString })}>
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
