import { mapValues } from 'lodash'

import { AsyncReturnType } from './async-return-type'
import { RP } from './curve'
import { generate_partial_decryption_proof } from './threshold-keygen'

export const stringifyPartial = (proof: AsyncReturnType<typeof generate_partial_decryption_proof>) =>
  mapValues(proof, String)

export const destringifyPartial = (
  proof: ReturnType<typeof stringifyPartial>,
): AsyncReturnType<typeof generate_partial_decryption_proof> => ({
  g_to_secret_r: RP.fromHex(proof.g_to_secret_r),
  obfuscated_trustee_secret: BigInt(proof.obfuscated_trustee_secret),
  unlock_to_secret_r: RP.fromHex(proof.unlock_to_secret_r),
})
