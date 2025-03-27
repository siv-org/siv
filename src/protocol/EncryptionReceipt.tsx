import { mapValues, omit } from 'lodash-es'
import { stringToPoint } from 'src/crypto/curve'

import { DetailedEncryptionReceipt } from '../vote/submitted/DetailedEncryptionReceipt'
import { public_key, voters } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function EncryptionReceipt(): JSX.Element {
  const { state } = useVoteContext()

  // Convert this protocol demo's state into a compatible object
  // for the main app's <DetailedEncryptionReceipt />
  const demoState = {
    election_title: 'Demo Election',
    encoded: mapValues(state.plaintext, (value) => stringToPoint(`${state.verification}:${value}`).toHex()),
    encrypted: mapValues(omit(state.encrypted, 'auth'), (value) => {
      const [, encrypted, lock] = value?.match(/encrypted: (.*?), lock: (.*?) }/) || []
      return { encrypted: encrypted || '', lock: lock || '' }
    }),
    plaintext: state.plaintext as Record<string, string>,
    public_key,
    randomizer: state.randomizer as Record<string, string>,
    submitted_at: new Date(),
    tracking: state.verification,
  }

  return <DetailedEncryptionReceipt auth={voters[0].auth} election_id="123" state={demoState} />
}
