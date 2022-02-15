import { supabase } from 'api/_supabase'
import { buildSubject } from 'api/invite-voters'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'

export type VoterInvites = Record<string, string[]>

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }
  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const subject = buildSubject(jwt.election_title)

  const headers = 'json->event-data->message->headers'
  const toPath = headers + '->to'
  const subjectPath = headers + '->subject'
  const { data, error } = await supabase
    .from('mailgun-deliveries')
    .select(`${toPath}, created_at`)
    .eq(subjectPath, JSON.stringify(subject))

  if (error) return res.status(400).json({ error })

  const deliveries = data?.reduce((memo, { created_at, to }) => {
    memo[to] = [...(memo[to] || []), created_at]
    return memo
  }, {})

  res.status(200).json(deliveries as VoterInvites)
}
