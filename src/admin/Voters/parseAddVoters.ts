import { validate as validateEmail } from 'email-validator'

export type ParsedVoter = { display_name?: string; email: string; }

/**
 * Parse admin-pasted voter input into structured records.
 *
 * Supported input styles:
 * - One per line: `email`
 * - Two columns (tab or comma): `email<TAB>Display Name` or `Display Name<TAB>email`
 * - Email-client recipients:
 *   - `"John Doe" <john@x.com>`
 *   - `John Doe <john@x.com>`
 *   - Comma-separated recipients on one line (splits on commas outside quotes/angle brackets)
 *
 * Notes:
 * - We intentionally accept fast "fake" emails like `1@1` (loose detection),
 *   but prefer strict validation when it’s clearly available.
 */
export function parseAddVoters(input: string): ParsedVoter[] {
  const results: ParsedVoter[] = []
  const seen = new Set<string>()

  for (const rawLine of input.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    // Split a line into multiple recipients if it's email-client style.
    for (const part of splitOutsideQuotesAndAngles(line, ',')) {
      const rec = parseOneRecipient(part.trim())
      if (!rec) continue

      // Dedupe by normalized email
      const email = normalizeEmail(rec.email)
      if (!email) continue
      if (seen.has(email)) continue
      seen.add(email)

      results.push({ display_name: rec.display_name, email })
    }
  }

  return results
}

function cleanupDisplayName(s: string): string {
  const t = s.trim()
  if (!t) return ''
  // Strip leading/trailing quotes and surrounding punctuation.
  return t.replace(/^[\s"'“”]+/, '').replace(/[\s"'“”]+$/, '').replace(/^[,;]+|[,;]+$/g, '').trim()
}

function isLooselyEmailLike(s: string): boolean {
  // Accept "1@1" etc (no spaces, one '@', non-empty sides).
  const t = s.trim()
  if (!t || /\s/.test(t)) return false
  const at = t.indexOf('@')
  return at > 0 && at === t.lastIndexOf('@') && at < t.length - 1
}

function looksLikeHeader(tokens: string[]): boolean {
  const lower = tokens.map((t) => t.toLowerCase())
  const hasEmailWord = lower.some((t) => t.includes('email'))
  const hasNameWord = lower.some((t) => t.includes('name') || t.includes('display'))
  const hasValidEmail = tokens.some((t) => validateEmail(t) || isLooselyEmailLike(t))
  return (hasEmailWord || hasNameWord) && !hasValidEmail
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function parseOneRecipient(s: string): null | ParsedVoter {
  if (!s) return null

  // Handle `Name <email>` (with or without quotes)
  const angleMatch = s.match(/^(.*)<\s*([^>]+)\s*>\s*$/)
  if (angleMatch) {
    const maybeName = cleanupDisplayName(angleMatch[1])
    const maybeEmail = angleMatch[2].trim()
    const email = pickEmailToken([maybeEmail]) || maybeEmail
    if (!isLooselyEmailLike(email)) return null
    return { display_name: maybeName || undefined, email }
  }

  // Two-column style: tab or comma separated.
  // Prefer tab if present (google sheets paste).
  const delim = s.includes('\t') ? '\t' : s.includes(',') ? ',' : null
  if (delim) {
    const tokens = s
      .split(delim)
      .map((t) => t.trim())
      .filter(Boolean)

    // If it looks like a header row, skip it.
    if (looksLikeHeader(tokens)) return null

    if (tokens.length === 1) {
      const email = tokens[0]
      return isLooselyEmailLike(email) ? { email } : null
    }

    const email = pickEmailToken(tokens)
    if (!email) return null
    const display = tokens.filter((t) => t !== email).join(' ').trim()
    return { display_name: cleanupDisplayName(display) || undefined, email }
  }

  // Plain: just an email token
  return isLooselyEmailLike(s) ? { email: s } : null
}

function pickEmailToken(tokens: string[]): null | string {
  // Prefer strict validation when possible.
  const strict = tokens.find((t) => validateEmail(t))
  if (strict) return strict

  // Otherwise accept loose emails like `1@1`.
  return tokens.find((t) => isLooselyEmailLike(t)) || null
}

function splitOutsideQuotesAndAngles(s: string, delimiter: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  let angleDepth = 0

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '"') inQuotes = !inQuotes
    if (!inQuotes) {
      if (ch === '<') angleDepth++
      if (ch === '>' && angleDepth > 0) angleDepth--
    }

    if (ch === delimiter && !inQuotes && angleDepth === 0) {
      out.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }

  out.push(cur)
  return out
}
