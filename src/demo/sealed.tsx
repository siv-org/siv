import { useContext } from '../context'
import { encode } from '../crypto/encode'
import encrypt from '../crypto/encrypt'
import pickRandomInteger from '../crypto/pick-random-integer'
import { public_key } from '../crypto/sample-key'
import { big, stringify } from '../crypto/types'
import { PrintJSON } from './plaintext'

export default function Sealed(): JSX.Element {
  const { state } = useContext()

  return (
    <div style={{ overflowWrap: 'break-word' }}>
      <PrintJSON color="#9013fe" obj={encryptValues(state)} />
    </div>
  )
}

type Map = Record<string, string>

function encryptValues(object: Map) {
  const encrypted: Map = {}
  Object.keys(object).map((key) => {
    encrypted[key] = stringify(encrypt(public_key, pickRandomInteger(public_key.modulo), big(encode(object[key]))))
  })

  return encrypted
}
