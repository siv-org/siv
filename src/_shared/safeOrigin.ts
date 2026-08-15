import type { NextApiRequest } from 'next'

/**
 * Canonical site origin for server-built URLs (emails, unlock fan-out).
 *
 * Do not use `req.headers.host` or `Origin` as the URL. A client can send
 * `Host: attacker.example.com` to put secrets in links or POST them off-box.
 *
 * On Vercel, `VERCEL_URL` is this deployment (System Environment Variables
 * must be enabled). We still validate it instead of falling back to Host.
 *
 * `requestHost` is only a mismatch alarm: if env looks like local but Host is
 * not loopback, refuse. Poisoned Host cannot become the origin.
 */
type OriginEnv = { PORT?: string; VERCEL_URL?: string }

/** Use VERCEL_URL instead of trusting `req.headers.host`, which can be spoofed */
export function safeOrigin(req?: NextApiRequest, env?: OriginEnv): string | { error: string } {
  const { PORT, VERCEL_URL } = env ?? process.env

  if (VERCEL_URL) {
    const host = parseHostname(VERCEL_URL)
    if (typeof host !== 'string') return host
    if (!isExpectedHost(host))
      return { error: `VERCEL_URL host '${host}' is not localhost, siv.org, or *-sivteam.vercel.app.` }
    return `https://${host}`
  }

  // eslint-disable-next-line siv/no-req-headers-host -- mismatch alarm only; not used as the origin
  const requestHost = typeof req?.headers?.host === 'string' ? req.headers.host : req?.headers?.host?.[0]
  if (!isLoopbackHost(requestHost)) return { error: `VERCEL_URL is unset but request Host is '${requestHost}'` }

  return `http://localhost:${PORT || '3000'}`
}

function isExpectedHost(host: string) {
  const hostname = host.split(':')[0].toLowerCase()
  return hostname === 'localhost' || hostname === 'siv.org' || hostname.endsWith('-sivteam.vercel.app')
}

function isLoopbackHost(host?: string) {
  const hostname = host?.split(':')[0].toLowerCase()
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

function parseHostname(raw: string | undefined): string | { error: string } {
  if (!raw?.trim())
    return { error: 'VERCEL_URL is missing or empty. Refusing to guess an origin, request Host could be poisoned.' }

  const stripped = raw
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')

  if (!stripped || /[/?#@]/.test(stripped) || stripped.includes('://'))
    return { error: `VERCEL_URL must be a bare hostname (optionally with https://), got '${raw}'` }

  return stripped
}
