// This script will re-write mailgun deliveries from ariana@secureinternetvoting.org to ariana@siv.org.

import { supabase } from 'api/_supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Should not be accessible from public urls
  if (!req.headers.host?.includes('localhost')) return res.status(403).json({ error: 'Forbidden' })

  // Get all deliveries from supabase
  const { count, data } = await supabase
    .from('mailgun-deliveries')
    // .select('*', { count: 'exact' })
    // .order('id', { ascending: false })
    .update({ from: 'ariana@siv.org' })
    .eq('from', 'ariana@secureinternetvoting.org')
  // .limit(10)

  res.status(201).send({ count, length: data?.length })
}
