export const BallotDesigner = () => (
  <>
    <p>Ballot design:</p>
    <textarea
      defaultValue={`[
  {
    question: 'Who should become President?',
    choices: [
      'George H. W. Bush',
      'Bill Clinton',
      'Ross Perot',
    ],
    write_in_allowed: true,
  }
]`}
      id="ballot-design"
    />

    <style jsx>{`
      p {
        margin-bottom: 0px;
      }

      textarea {
        border-color: #ccc;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        height: 200px;
        padding: 8px;
        resize: vertical;
        width: 100%;
      }
    `}</style>
  </>
)
