import { useContext } from '../context'
import { PrintJSON } from './plaintext'

export default function Sealed(): JSX.Element {
  const { state } = useContext()

  return (
    <div style={{ overflowWrap: 'break-word' }}>
      <PrintJSON color="#9013fe" obj={state.encrypted} />
    </div>
  )
}
