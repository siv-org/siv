import { readFileSync } from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __thisDir = dirname(__filename)

const voterCodeAuthTokens = JSON.parse(
  readFileSync(path.join(__thisDir, 'ready-for-tallying-voter-code-auth-tokens.json'), 'utf8'),
)
const provisionalAuthTokens = readFileSync(path.join(__thisDir, 'accepted-provisionals.txt'), 'utf8').split('\n')

const readyForTallyingAuthTokens11Chooses = [...voterCodeAuthTokens, ...provisionalAuthTokens]

export { readyForTallyingAuthTokens11Chooses }
