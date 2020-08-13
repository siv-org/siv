import { useState } from 'react'

import { OnClickButton } from '../landing-page/Button'

export const AddGroup = ({
  defaultValue,
  disabled,
  message,
  onClick,
  type,
}: {
  defaultValue?: string
  disabled?: boolean
  message: string
  onClick: () => boolean | Promise<boolean>
  type: string
}) => {
  const [sent, setSent] = useState(false)
  const textarea_id = `${type}-input`

  return (
    <div className="container">
      <label htmlFor={textarea_id}>Add {type} by email address:</label>
      <div className="textarea-wrapper">
        <textarea {...{ defaultValue }} disabled={disabled && type !== 'voters'} id={textarea_id} wrap="off" />
      </div>
      <div className="right-aligned">
        <OnClickButton
          background="white"
          disabled={disabled || sent}
          onClick={async () => checkPassword() && (await onClick()) && setSent(true)}
          style={{ marginRight: 0, padding: '8px 17px' }}
        >
          {!sent ? 'Send Invitation' : 'Sent.'}
        </OnClickButton>
        {disabled && <p className="message">{message}</p>}
      </div>
      <style jsx>{`
        .container {
          flex-direction: column;
          width: 44%;
        }

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

        textarea:disabled {
          cursor: not-allowed;
        }

        .textarea-wrapper {
          display: inline-block;
          background-image: linear-gradient(#f4f4f4 50%, #f9f9f9 50%);
          background-size: 100% 32px;
          background-position: left 21px;
          width: 100%;
        }

        .right-aligned {
          text-align: right;
        }

        .message {
          margin-top: 0;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}

function checkPassword() {
  if (!localStorage.password) {
    localStorage.password = prompt('Admin password?')
  }

  return true
}
