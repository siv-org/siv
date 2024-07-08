import { groupBy, mapKeys, mapValues, pick } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { format as timeAgo } from 'timeago.js'

import { firebase } from './_services'

const { RECENT_ELECTIONS_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they have password
  if (!RECENT_ELECTIONS_PASSWORD) return res.status(401).send('Server missing process.env.RECENT_ELECTIONS_PASSWORD')
  const { pass } = req.query
  if (pass !== RECENT_ELECTIONS_PASSWORD) return res.status(401).send('Unauthorized')

  // Get recent elections
  const thirtyDays = 1000 * 60 * 60 * 24 * 30
  const electionsDocs = firebase
    .firestore()
    .collection('elections')
    .where('created_at', '>', new Date(Date.now() - thirtyDays))
    .get()

  // Format elections list
  const elections = (await electionsDocs).docs.map((doc) => {
    const data = doc.data()
    return {
      created: timeAgo(new Date(data.created_at._seconds * 1000))
        .replace(' day', 'd')
        .replace(' week', 'w')
        .replace('s', ''),
      ...pick(data, ['election_manager', 'election_title']),
      stats: `${plural(data.num_voters, 'voter')}, ${plural(data.num_votes, 'vote')}, ${
        (data.decrypted || []).length
      } unlocked`,
    }
  })
  const elections_by_manager = groupBy(elections, 'election_manager')
  const formattedKeys = mapKeys(elections_by_manager, (value, key) => key + ` — ${value.length}`)

  const formatted = mapValues(formattedKeys, (elections) =>
    elections.map((e, i) => `${i + 1}. ${e.created}  ${e.election_title}  [${e.stats}]`),
  )

  res.status(200).json({
    elections_created_last_30_days: {
      _total: elections.length,
      ...formatted,
    },
  })
}

function plural(n: number, singular: string) {
  return `${n} ${singular}${n === 1 ? '' : 's'}`
}
