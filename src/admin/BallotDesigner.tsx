export const BallotDesigner = () => (
  <>
    <p>Enter ballot questions: </p>
    <textarea disabled>
      {`[
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
    </textarea>

    <style jsx>{`
      textarea {
        width: 100%;
        height: 220px;
        padding: 8px;
      }
    `}</style>
  </>
)
