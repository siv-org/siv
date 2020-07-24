import { Big, Cipher_Text, Public_Key } from './types'

export default function encrypt(public_key: Public_Key, random_sealing_key: Big, message: Big): Cipher_Text {
  const { generator, modulo, sealing_target } = public_key

  // Calculate our encrypted message
  const shared_secret = sealing_target.modPow(random_sealing_key, modulo)
  const sealed_data = message.multiply(shared_secret).mod(modulo)

  // This sealing factor lets someone with the unsealing key reverse the encryption
  const sealing_factor = generator.modPow(random_sealing_key, modulo)

  return { sealed_data, sealing_factor }
}
