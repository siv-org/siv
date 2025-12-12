import { readFileSync } from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __thisDir = dirname(__filename)

const readyForTallyingAuthTokens11Chooses = JSON.parse(
  readFileSync(path.join(__thisDir, 'ready-for-tallying-auth-tokens.json'), 'utf8'),
)

export { readyForTallyingAuthTokens11Chooses }
