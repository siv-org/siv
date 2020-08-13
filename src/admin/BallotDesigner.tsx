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
        width: 320px;
        max-width: 100%;
        height: 190px;
        padding: 8px;
        cursor: not-allowed;
      }
    `}</style>
  </>
)
