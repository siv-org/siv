// /api/internal/pusher-channels
//
// Snapshot of currently occupied Pusher channels + subscription_count.
// Refresh in the browser to monitor.
//
// localhost:3000/api/internal/pusher-channels?pass=your-secret-here

import { NextApiRequest, NextApiResponse } from 'next'
import { escapeHtml } from 'src/_shared/escapeHtml'

import { pusher } from '../pusher'

const { INTERNAL_VOTER_LOOKUP_PASS } = process.env

type ChannelRow = { channel: string; subscription_count: number }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isLocalhostRequest(req)) return res.status(403).json({ error: 'localhost only' })

  if (!INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(501).json({ error: 'Server missing process.env.INTERNAL_VOTER_LOOKUP_PASS' })

  const { pass } = req.query
  if (typeof pass !== 'string' || pass !== INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(401).json({ error: 'Bad password' })

  const listRes = await pusher.get({ params: {}, path: '/channels' })
  if (listRes.status !== 200) return res.status(502).json({ error: 'Pusher list failed', status: listRes.status })
  const list = (await listRes.json()) as { channels: Record<string, unknown> }
  const names = Object.keys(list.channels || {}).sort()

  const channels: ChannelRow[] = []
  for (const channel of names) {
    const r = await pusher.get({ params: { info: 'subscription_count' }, path: `/channels/${channel}` })
    if (r.status !== 200) {
      channels.push({ channel, subscription_count: -1 })
      continue
    }
    const body = (await r.json()) as { subscription_count?: number }
    channels.push({ channel, subscription_count: body.subscription_count ?? 0 })
  }

  const sum_subscription_count = channels.reduce((n, c) => n + Math.max(0, c.subscription_count), 0)
  const snapshot = {
    at: new Date().toISOString(),
    channels,
    occupied: channels.length,
    sum_subscription_count,
  }

  return res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(renderHtml(snapshot))
}

function isLocalhostRequest(req: NextApiRequest): boolean {
  const addr = req.socket.remoteAddress
  if (!addr) return false
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1'
}

function renderHtml(snapshot: {
  at: string
  channels: ChannelRow[]
  occupied: number
  sum_subscription_count: number
}) {
  const rows = snapshot.channels
    .map(
      (c) =>
        `<tr><td><code>${escapeHtml(c.channel)}</code></td><td style="text-align:right">${
          c.subscription_count
        }</td></tr>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Pusher channels</title>
  <style>
    body { font: 13px/1.35 system-ui, sans-serif; margin: 16px; color: #111; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    .meta { color: #555; margin-bottom: 12px; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 4px 8px; }
    th { text-align: left; background: #f6f6f6; }
    code { font-size: 12px; }
    .empty { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <h1>Pusher channels</h1>
  <p class="meta">
    ${escapeHtml(snapshot.at)} ·
    occupied ${snapshot.occupied} ·
    sum(subscription_count) ${snapshot.sum_subscription_count}
  </p>
  ${
    snapshot.channels.length
      ? `<table>
    <thead><tr><th>channel</th><th>subscription_count</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="meta">Note: one admin tab ≈ keygen-* + status-* (2 subs, 1 connection).</p>`
      : `<p class="empty">No occupied channels right now.</p>`
  }
</body>
</html>`
}
