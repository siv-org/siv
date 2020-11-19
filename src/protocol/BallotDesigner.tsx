export const BallotDesigner = () => (
  <>
    <textarea
      disabled
      value={`[{
  title: 'Who should be the next mayor?',
  options: [
    'Angela Alioto',
    'London Breed',
    'Mark Leno',
    'Jane Kim',
]}]`}
    />

    <style jsx>{`
      textarea {
        font-size: 13px;
        height: 180px;
        max-width: 400px;
        padding: 10px;
        resize: none;
        width: 100%;
      }
    `}</style>
  </>
)
