import { exec } from 'child_process'
import { promisify } from 'util'

import { big } from './types'

const execAsync = promisify(exec)

async function generate_safe_prime(bit_size: number) {
  const { stdout } = await execAsync(`openssl dhparam ${bit_size} -text`)

  const prime = stdout.split('\n')[1].trim().split(' ')[1]

  // OpenSSL uses a different output format for larger sizes
  if (bit_size > 64) {
    // console.log({ stdout })
    // console.log({ prime })
  }

  return big(prime)
}

export default generate_safe_prime
