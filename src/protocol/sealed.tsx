import { useVoteContext } from '../vote-context'
import { PrintJSON } from './plaintext'

export default function Sealed(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <div style={{ overflowWrap: 'break-word' }}>
      <PrintJSON color="#9013fe" obj={state.encrypted} />
    </div>
  )
}
