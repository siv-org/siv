import { PrintJSON } from './Plaintext'
import { useVoteContext } from './VoteContext'

export function Sealed(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <div style={{ overflowWrap: 'break-word' }}>
      <PrintJSON color="#9013fe" obj={state.encrypted} />
    </div>
  )
}
