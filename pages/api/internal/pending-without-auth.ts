// /api/internal/pending-without-auth
//
// election_id => pending ballots that never got registration/auth info
//
// localhost:3000/api/internal/pending-without-auth?election_id=YOUR_ELECTION_ID&pass=your-secret-here

import type { DocumentData } from 'firebase-admin/firestore'

import { firebase } from 'api/_services'
import { NextApiRequest, NextApiResponse } from 'next'
import UAParser from 'ua-parser-js'

const { INTERNAL_VOTER_LOOKUP_PASS } = process.env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isLocalhostRequest(req)) return res.status(403).json({ error: 'localhost only' })

  if (!INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(501).json({ error: 'Server missing process.env.INTERNAL_VOTER_LOOKUP_PASS' })

  const { election_id, pass } = req.query
  if (typeof pass !== 'string' || pass !== INTERNAL_VOTER_LOOKUP_PASS)
    return res.status(401).json({ error: 'Bad password' })
  if (typeof election_id !== 'string' || !election_id) return res.status(400).json({ error: 'election_id is required' })

  const electionRef = firebase.firestore().collection('elections').doc(election_id)
  const electionSnap = await electionRef.get()
  if (!electionSnap.exists) return res.status(404).json({ error: 'Election not found' })

  const pendingSnap = await electionRef.collection('votes-pending').get()
  const withoutAuth = pendingSnap.docs
    .filter((d) => !d.data()?.auth_added_at)
    .map((d) => summarizePending(d.id, d.data()))
    .sort((a, b) => String(a._submitted_at || '').localeCompare(String(b._submitted_at || '')))

  return res.status(200).json({
    election_id,
    election_title: electionSnap.data()?.election_title,
    pending_total: pendingSnap.size,
    pending_without_auth: withoutAuth.length,
    without_auth: withoutAuth,
  })
}

function formatDevice(userAgent: string | undefined) {
  if (!userAgent) return null
  const ua = UAParser(userAgent)
  const device = `${ua.browser.name || '?'} ${ua.browser.version || ''} on ${ua.os.name || '?'} ${
    ua.os.version || ''
  }`.trim()
  // Facebook / Instagram in-app browsers are easy to miss otherwise
  if (/FBAN|FBAV|FB_IAB|Instagram/i.test(userAgent)) return `${device}`
  return device
}

function isLocalhostRequest(req: NextApiRequest): boolean {
  const addr = req.socket.remoteAddress
  if (!addr) return false
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1'
}

function summarizePending(doc_id: string, data: DocumentData | undefined) {
  const headers = data?.headers as Record<string, string> | undefined
  const rawUa = headers?.['user-agent']
  const geoHeaders = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
  const location = geoHeaders.map((header) => data?.headers[header]?.toString().replaceAll('%20', ' ')).join(', ')

  return {
    _submitted_at: data?.created_at?.toDate?.()?.toLocaleString?.() || data?.created_at || null,
    device: formatDevice(rawUa),
    geolocation: location,
    ip: headers?.['x-real-ip'] || headers?.['x-forwarded-for'] || null,
    link_auth: data?.link_auth || doc_id,
  }
}
