import { mapValues } from 'lodash'

import { AsyncReturnType } from './async-return-type'
import { RP } from './curve'
import { generate_partial_decryption_proof } from './threshold-keygen'

export const stringifyPartial = (proof: AsyncReturnType<typeof generate_partial_decryption_proof>) =>
  mapValues(proof, String)

export const destringifyPartial = (
  proof: ReturnType<typeof stringifyPartial>,
): AsyncReturnType<typeof generate_partial_decryption_proof> => ({
  LR: RP.fromHex(proof.LR),
  O: BigInt(proof.O),
  R: RP.fromHex(proof.R),
})
