import { useContext } from '../context'
import { PrintJSON } from './plaintext'

export default function Sealed(): JSX.Element {
  const { state } = useContext()

  return (
    <div>
      <PrintJSON color="#9013fe" obj={encryptValues(state)} />
    </div>
  )
}

type Map = Record<string, string>

function encryptValues(object: Map) {
  const encrypted: Map = {}
  Object.keys(object).map((key) => {
    encrypted[`encrypted_${key}`] = 'foo'
  })

  return encrypted
}
