import { useContext } from '../context'

export default function Plaintext(): JSX.Element {
  const { state } = useContext()

  return <PrintJSON color="blue" obj={state} />
}

export const PrintJSON = ({ color = 'black', obj }: { color?: string; obj: Record<string, string> }) => (
  <div style={{ fontFamily: 'monospace', left: '12%', marginTop: 15, position: 'relative' }}>
    {'{'}
    <br />
    {Object.keys(obj).map((key) => (
      <p key={key} style={{ margin: '0 15px' }}>
        {key}: <span style={{ color }}>&apos;{obj[key]}&apos;</span>,
      </p>
    ))}
    {'}'}
  </div>
)
