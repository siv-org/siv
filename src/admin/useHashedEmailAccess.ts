import { useEffect, useState } from 'react'
import { bytesToHex } from 'src/crypto/bytes-to-hex'
import { sha256 } from 'src/crypto/sha256'

// TIP: Check `src/admin/hashed-emails.csv`, gitignored, for the full list. Hopefully up-to-date.

const emailHash = async (email: string) =>
  bytesToHex(new Uint8Array(await sha256(email + 'saltedsdjfksj'))).slice(0, 15)

/**
 * Call at module scope next to an allowlist. Paste emails in, reload, copy hashes into the
 * allowlist, then clear the array before commit.
 *
 *   `void printEmailHashes(['someone@example.com'])`
 */
export async function printEmailHashes(emails: string[]) {
  if (!emails.length) return
  const lines = await Promise.all(emails.map(async (email) => `${await emailHash(email)}: '${email}'`))
  alert(lines.join('\n'))
}

/** Check if current user has access to a feature, based on their email and a hashed allowlist. */
export function useHashedEmailAccess(email: string | undefined, allowed: Record<string, string>) {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      if (!email) return
      if ((await emailHash(email)) in allowed) setHasAccess(true)
    }
    checkAccess()
  }, [email, allowed])

  return hasAccess
}
