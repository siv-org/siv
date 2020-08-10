export const AddVoters = () => (
  <>
    <p>Add voters by email address, 1 per line:</p>
    <textarea />
    <input type="submit" value="Save" />
    <style jsx>{`
      textarea {
        width: 100%;
        height: 200px;
        font-size: 20px;
        padding: 8px;
      }

      input {
        float: right;
        font-size: 20px;
      }
    `}</style>
  </>
)
