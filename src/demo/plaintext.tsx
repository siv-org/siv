import { useContext } from '../context'

export default function Plaintext(): JSX.Element {
  const { state } = useContext()

  return <PrintJSON obj={state} />
}

const PrintJSON = ({ obj }: { obj: Record<string, string> }) => (
  <div style={{ color: 'blue', fontFamily: 'monospace', left: '12%', marginTop: 15, position: 'relative' }}>
    {'{'}
    <br />
    {Object.keys(obj).map((key) => (
      <p key={key} style={{ margin: '0 15px' }}>
        {key}: &apos;{obj[key]}&apos;,
      </p>
    ))}
    {'}'}
  </div>
)
