export const AddPeople = ({ type }: { type: string }) => (
  <>
    <p>Add {type} by email address, 1 per line:</p>
    <textarea />
    <div>
      <input type="submit" value="Save" />
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
