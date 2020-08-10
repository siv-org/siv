export const AddPeople = ({ disabled, type }: { disabled?: boolean; type: string }) => (
  <>
    <p>Add {type} by email address, 1 per line:</p>
    <textarea />
    <div>
      <input disabled={disabled} type="submit" value="Send Invitation" />
      {disabled && <p>Waiting on Trustees to generate public key first</p>}
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
