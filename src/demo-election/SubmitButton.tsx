import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'

export const SubmitButton = ({ auth, encrypted_vote }: { auth: string; encrypted_vote: string }) => {
  return (
    <div>
      <OnClickButton onClick={() => api('subit-vote', { auth, encrypted_vote })}>Submit</OnClickButton>
      <style jsx>{`
        div {
          text-align: right;
        }
      `}</style>
    </div>
  )
}
