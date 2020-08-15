export const BallotDesigner = () => (
  <>
    <p>Ballot design:</p>
    <textarea
      disabled
      value={`[
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
    />

    <style jsx>{`
      p {
        margin-bottom: 0px;
      }

      textarea {
        background: #eee;
        border-color: #ccc;
        border-radius: 4px;
        cursor: not-allowed;
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
