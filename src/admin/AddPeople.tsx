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
    <div className="textarea-wrapper">
      <textarea disabled={disabled && type !== 'voters'} />
    </div>
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

        background: url(http://i.imgur.com/2cOaJ.png);
        background-attachment: local;
        background-repeat: no-repeat;
        padding-left: 35px;
        padding-top: 10px;
        border-color: #ccc;

        font-size: 13px;
        line-height: 16px;
      }

      .textarea-wrapper {
        display: inline-block;
        background-image: linear-gradient(#f1f1f1 50%, #f9f9f9 50%);
        background-size: 100% 32px;
        background-position: left 10px;
        width: 100%;
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
