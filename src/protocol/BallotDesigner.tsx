export const BallotDesigner = () => (
  <>
    <textarea
      disabled
      value={`[{
  question: 'Who should be the next mayor?',
  choices: [
    'Angela Alioto',
    'London Breed',
    'Mark Leno',
    'Jane Kim',
  ]
}]`}
    />

    <style jsx>{`
      textarea {
        min-width: 400px;
        height: 180px;
        padding: 10px;
        font-size: 13px;
        resize: none;
      }
    `}</style>
  </>
)
