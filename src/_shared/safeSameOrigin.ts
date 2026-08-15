/**
 * Origin for server-to-self HTTP (e.g. unlock fanning out to decrypt-column).
 *
 * Do not use `req.headers.host` as the fetch origin. A client can send
 * `Host: attacker.example.com` to trick into POSTing secrets to them.
 *
 * On Vercel, `VERCEL_URL` is this deployment (System Environment Variables
 * must be enabled). We still validate it instead of falling back to Host.
 *
 * `requestHost` is only a mismatch alarm: if env looks like local but Host is
 * not loopback, refuse. Poisoned Host cannot become the origin.
 */
type SameOriginEnv = { PORT?: string; VERCEL_URL?: string }

export function safeSameOrigin(requestHost?: string, env?: SameOriginEnv): string | { error: string } {
  const { PORT, VERCEL_URL } = env ?? process.env

  // Logic when we appear to be on Vercel (prod or preview deployments)
  if (VERCEL_URL) {
    const host = parseHostname(VERCEL_URL)
    if (typeof host !== 'string') return host
    if (!isExpectedHost(host))
      return { error: `VERCEL_URL host '${host}' is not localhost, siv.org, or *-sivteam.vercel.app.` }
    return `https://${host}`
  }

  // Fallback is for local dev, but error early if request.host doesn't match localhost.
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
