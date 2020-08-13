import { OnClickButton } from '../landing-page/Button'

export const AddPeople = ({
  disabled,
  onClick = () => {},
  type,
  message,
}: {
  disabled?: boolean
  message: string
  onClick?: () => void
  type: string
}) => (
  <>
    <p>Add {type} by email address, 1 per line:</p>
    <div className="textarea-wrapper">
      <textarea disabled={disabled && type !== 'voters'} id={`${type}-input`} />
    </div>
    <div>
      {disabled && <span>{message}</span>}
      <OnClickButton
        disabled={disabled}
        onClick={() => checkPassword() && onClick()}
        style={{ marginRight: 0, padding: '8px 17px' }}
      >
        Send Invitation
      </OnClickButton>
    </div>
    <style jsx>{`
      textarea {
        width: 100%;
        height: 87px;
        resize: vertical;

        background: url(https://i.imgur.com/2cOaJ.png);
        background-position: -11px -6px;
        background-attachment: local;
        background-repeat: no-repeat;
        padding-left: 23px;
        padding-top: 3px;
        border-color: #ccc;

        font-size: 13px;
        line-height: 16px;
      }

      .textarea-wrapper {
        display: inline-block;
        background-image: linear-gradient(#f4f4f4 50%, #f9f9f9 50%);
        background-size: 100% 32px;
        background-position: left 21px;
        width: 100%;
      }

      div {
        text-align: right;
      }
    `}</style>
  </>
)

function checkPassword() {
  if (!localStorage.password) {
    localStorage.password = prompt('Password?')
  }

  return true
}
