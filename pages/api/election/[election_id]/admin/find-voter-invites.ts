import { supabase } from 'api/_supabase'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'

export type VoterInvites = Record<string, string[]>

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id?: string }
  if (!election_id) return res.status(401).json({ error: 'Missing election_id' })

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const { data, error } = await supabase
    .from('mailgun-deliveries')
    .select(`to, created_at`)
    .contains('tags', `{"invite-voter-${election_id}"}`)

  if (error) return res.status(400).json({ error })

  const deliveries = data?.reduce((memo, { created_at, to }) => {
    memo[to] = [...(memo[to] || []), created_at]
    return memo
  }, {})

  res.status(200).json(deliveries as VoterInvites)
}
