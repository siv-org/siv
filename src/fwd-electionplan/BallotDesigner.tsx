import { candidates } from './election-parameters'

export const BallotDesigner = () => (
  <>
    <textarea
      disabled
      value={`[{
  title: 'Who should be the next mayor?',
  options: [
    '${candidates.join("',\n    '")}',
]}]`}
    />
    <label>An example ballot schema</label>

    <style jsx>{`
      textarea {
        font-size: 13px;
        height: 180px;
        max-width: 400px;
        padding: 10px;
        resize: none;
        width: 100%;
      }

      label {
        font-size: 13px;
        opacity: 0.5;
        display: block;
        font-style: italic;
        margin-bottom: 15px;
      }
    `}</style>
  </>
)
