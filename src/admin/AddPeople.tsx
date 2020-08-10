import { Dispatch, SetStateAction } from 'react'

export const AddPeople = ({
  disabled,
  setPubKey,
  type,
}: {
  disabled?: boolean
  setPubKey?: Dispatch<SetStateAction<boolean>>
  type: string
}) => (
  <>
    <p>Add {type} by email address, 1 per line:</p>
    <textarea disabled={disabled && type !== 'voters'} />
    <div>
      <input disabled={disabled} onClick={() => setPubKey && setPubKey(true)} type="submit" value="Send Invitation" />
      {disabled && (
        <p>
          {type === 'voters'
            ? `Waiting on Trustees to generate public key first`
            : `Trustees generated public key 23509282789382352`}
        </p>
      )}
    </div>
    <style jsx>{`
      textarea {
        width: 100%;
        height: 200px;
        font-size: 20px;
        padding: 8px;
      }

      div {
        text-align: right;
      }

      input {
        font-size: 20px;
      }
    `}</style>
  </>
)
