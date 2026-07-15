// /api/internal/pending-votes
//
// election_id => all pending ballots (HTML table by default; ?format=csv for raw CSV)
//
// localhost:3000/api/internal/pending-votes?election_id=YOUR_ELECTION_ID&pass=your-secret-here

import type { DocumentData } from 'firebase-admin/firestore'

import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import UAParser from 'ua-parser-js'

const { INTERNAL_VOTER_LOOKUP_PASS } = process.env

const COLUMNS = [
  'link_auth',
  'submitted_at',
  'auth_added_at',
  'seconds_to_auth',
  'first_name',
  'last_name',
  'email',
  // 'is_email_verified',
  'verified_email_at',
  'email_marked_invalid_at',
  'additional_auth_info',
  'device',
  'ip',
  'geolocation',
] as const

type Row = Record<(typeof COLUMNS)[number], boolean | null | number | string>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isLocalhostRequest(req)) return res.status(403).json({ error: 'localhost only' })

  if (!INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(501).json({ error: 'Server missing process.env.INTERNAL_VOTER_LOOKUP_PASS' })

  const { election_id, format, pass } = req.query
  if (typeof pass !== 'string' || pass !== INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(401).json({ error: 'Bad password' })
  if (typeof election_id !== 'string' || !election_id) return res.status(400).json({ error: 'election_id is required' })

  const electionRef = firebase.firestore().collection('elections').doc(election_id)
  const electionSnap = await electionRef.get()
  if (!electionSnap.exists) return res.status(404).json({ error: 'Election not found' })

  const pendingSnap = await electionRef.collection('votes-pending').get()
  const rows = pendingSnap.docs
    .map((d) => rowFromPending(d.id, d.data()))
    .sort((a, b) => String(a.submitted_at).localeCompare(String(b.submitted_at)))

  const withoutAuth = rows.filter((r) => !r.auth_added_at).length
  const title = electionSnap.data()?.election_title || election_id

  if (format === 'csv') {
    const csv = [COLUMNS.join(','), ...rows.map((row) => COLUMNS.map((col) => csvEscape(row[col])).join(','))].join(
      '\n',
    )
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    return res.status(200).send(csv)
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return res.status(200).send(renderHtmlTable({ election_id, pass, rows, title, withoutAuth }))
}

function csvEscape(value: boolean | null | number | string) {
  if (value === null || value === '') return ''
  const s = String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`
  return s
}

function escapeHtml(value: boolean | null | number | string) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function formatDevice(userAgent: string | undefined) {
  if (!userAgent) return ''
  const ua = UAParser(userAgent)
  return `${ua.browser.name || '?'} ${ua.browser.version || ''} on ${ua.os.name || '?'} ${ua.os.version || ''}`.trim()
}

function isLocalhostRequest(req: NextApiRequest): boolean {
  const addr = req.socket.remoteAddress
  if (!addr) return false
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1'
}

function renderHtmlTable({
  election_id,
  pass,
  rows,
  title,
  withoutAuth,
}: {
  election_id: string
  pass: string
  rows: Row[]
  title: string
  withoutAuth: number
}) {
  const thead = COLUMNS.map((col) => `<th>${escapeHtml(col)}</th>`).join('')
  const tbody = rows
    .map((row) => {
      const missing = !row.auth_added_at
      const cells = COLUMNS.map((col) => `<td>${escapeHtml(row[col])}</td>`).join('')
      return `<tr class="${missing ? 'missing-auth' : ''}">${cells}</tr>`
    })
    .join('\n')

  const qs = `election_id=${encodeURIComponent(election_id)}&pass=${encodeURIComponent(pass)}`

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Pending votes — ${escapeHtml(title)}</title>
  <style>
    body { font: 13px/1.35 system-ui, sans-serif; margin: 16px; color: #111; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    .meta { color: #555; margin-bottom: 12px; }
    .meta a { color: #555; }
    table { border-collapse: collapse; width: max-content; max-width: 100%; }
    th, td { border: 1px solid #ddd; padding: 4px 8px; vertical-align: top; white-space: nowrap; }
    th { position: sticky; top: 0; background: #f4f4f4; text-align: left; font-weight: 600; }
    tr.missing-auth { background: #fff3cd; }
    tr:hover { background: #eef6ff; }
    tr.missing-auth:hover { background: #ffe8a3; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">
    ${rows.length} pending · ${withoutAuth} without auth · election ${escapeHtml(election_id)}
    · <a href="?${qs}">refresh</a>
    · <a href="?${qs}&format=csv">csv</a>
  </div>
  <table>
    <thead><tr>${thead}</tr></thead>
    <tbody>
${tbody}
    </tbody>
  </table>
</body>
</html>`
}

function rowFromPending(doc_id: string, data: DocumentData | undefined): Row {
  const headers = data?.headers as Record<string, string> | undefined
  const geoHeaders = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const submitted = toDate(data?.created_at)
  const authAdded = toDate(data?.auth_added_at)
  const seconds_to_auth = submitted && authAdded ? Math.round((authAdded.getTime() - submitted.getTime()) / 1000) : null

  return {
    additional_auth_info: data?.additionalAuthInfo ? JSON.stringify(data.additionalAuthInfo) : '',
    auth_added_at: authAdded?.toISOString() || '',
    device: formatDevice(headers?.['user-agent']),
    email: data?.email || '',
    email_marked_invalid_at: toDate(data?.email_marked_invalid_at)?.toISOString() || '',
    first_name: data?.first_name || '',
    geolocation: geoHeaders.map((h) => headers?.[h]?.toString().replaceAll('%20', ' ') || '').join(', '),
    ip: headers?.['x-real-ip'] || headers?.['x-forwarded-for'] || '',
    // is_email_verified: data?.is_email_verified ?? '',
    last_name: data?.last_name || '',
    link_auth: data?.link_auth || doc_id,
    seconds_to_auth,
    submitted_at: submitted?.toISOString() || '',
    verified_email_at: toDate(data?.verified_email_at)?.toISOString() || '',
  }
}

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') return (value as { toDate: () => Date }).toDate()
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}
