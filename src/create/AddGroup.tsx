import ms from 'ms'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { OnClickButton } from '../landing-page/Button'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const AddGroup = ({
  defaultValue,
  disabled,
  message,
  onSubmit,
  statusURL,
  type,
}: {
  defaultValue?: string
  disabled?: boolean
  message: string
  onSubmit: () => boolean | Promise<boolean>
  statusURL?: string
  type: string
}) => {
  const [status, setStatus] = useState<string>()
  const textarea_id = `${type}-input`

  // Check if they've submitted
  const { data } = useSWR(statusURL ? statusURL : null, fetcher, {
    refreshInterval: ms('5s'),
  })
  // Show which have submitted already
  useEffect(() => {
    if (!data) return
    const textarea = document.getElementById(textarea_id) as HTMLInputElement
    const newContent = textarea.value
      .split('\n')
      .map((line, index) => (data[index] && !line.includes('·') ? line + ' · ✔ Voted' : line))
      .join('\n')
    textarea.value = newContent
  }, [data])

  return (
    <div className="container">
      <label htmlFor={textarea_id}>Add {type} by email address:</label>
      <div className="textarea-wrapper">
        <textarea {...{ defaultValue }} disabled={!!status} id={textarea_id} wrap="off" />
      </div>
      <div className="right-aligned">
        {status !== 'Sent.' && (
          <OnClickButton
            background="white"
            disabled={disabled || !!status}
            style={{ marginRight: 0, padding: '8px 17px' }}
            onClick={async () => {
              if (!checkPassword()) return

              setStatus('Sending...')
              if (!(await onSubmit())) return setStatus(undefined)
              setStatus('Sent.')
            }}
          >
            {status || 'Send Invitation'}
          </OnClickButton>
        )}
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
          padding-left: 23px;
          padding-top: 3px;
          resize: vertical;

          background: url(https://i.imgur.com/2cOaJ.png);
          background-position: -11px -7px;
          background-attachment: local;
          background-repeat: no-repeat;
          border-color: #ccc;
          border-radius: 4px;

          font-size: 13px;
          line-height: 16px;
        }

        textarea:disabled {
          cursor: not-allowed;
        }

        .textarea-wrapper {
          display: inline-block;
          background-image: linear-gradient(#fafafa 50%, #fff 50%);
          background-size: 100% 32px;
          background-position: left 3px;
          width: 100%;
        }

        .right-aligned {
          text-align: right;
        }

        .message {
          margin-top: 0;
          font-size: 12px;
          overflow-wrap: break-word;
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
