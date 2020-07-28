import { useVoteContext } from './vote-context'

export function Plaintext(): JSX.Element {
  const { state } = useVoteContext()

  return <PrintJSON color="blue" obj={state.plaintext} />
}

export const PrintJSON = ({ color = 'black', obj }: { color?: string; obj: Record<string, string> }) => (
  <div style={{ fontFamily: 'monospace', marginTop: 15, padding: '0 6%' }}>
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
