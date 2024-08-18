import { randomBytes } from 'crypto'

export function generateAuthToken() {
  let auth_token = generateOne()
  let attempts = 1
  const max_attempts = 1000
  while (isBadPatterns(auth_token)) {
    auth_token = generateOne()
    attempts++
    if (attempts > max_attempts) throw `Couldn't generate good auth token with ${max_attempts} attempts`
  }
  return auth_token
}

function generateOne() {
  return randomBytes(5).toString('hex') // 10 characters hex string
}

const isBadPatterns = (auth_token: string) => {
  // All digits, other than a single 'e' somewhere in the middle
  // Could be accidentally parsed as # * 10^ #
  // (approx 7 in 1000 chance)
  if (/^[0-9][0-9]{0,6}e[0-9]{0,6}[0-9]$/i.test(auth_token)) return true

  return false
}
