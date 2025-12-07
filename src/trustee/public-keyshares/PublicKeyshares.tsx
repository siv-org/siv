import { RP } from 'src/crypto/curve'
import { compute_g_to_keyshare } from 'src/crypto/threshold-keygen'

import { State } from '../trustee-state'

export const PublicKeyshares = ({ data }: { data: State }) => {
  const { trustees } = data

  if (!trustees) return <>Missing trustees</>

  const Broadcasts = trustees.map((t) => t.commitments.map(RP.fromHex))

  const public_keyshares = trustees.map((t, index) => compute_g_to_keyshare(index + 1, Broadcasts))

  return (
    <ul className="my-8 space-y-3 w-full list-disc list-inside text-left break-words">
      {trustees.map((t, index) => (
        <li key={t.email}>
          <span className="block text-sm">{t.email}:</span>
          {public_keyshares[index] ? public_keyshares[index].toString() : 'Loading...'}
        </li>
      ))}
    </ul>
  )
}
