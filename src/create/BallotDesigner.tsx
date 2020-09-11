export const BallotDesigner = () => (
  <>
    <p>Ballot design:</p>
    <textarea
      defaultValue={`[
  {
    question: 'What is the best flavor of ice cream?',
    choices: [
      'Chocolate',
      'Cookie Dough',
      'Mint',
      'Strawberry',
      'Vanilla',
    ],
    allow_write_in: true,
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
