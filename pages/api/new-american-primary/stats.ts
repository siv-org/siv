import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../_services'

const { NAP_STATS_PASSWORD } = process.env

const election_id = '1721122924218'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they have password
  if (!NAP_STATS_PASSWORD) return res.status(401).send('Server missing process.env.NAP_STATS_PASSWORD')
  const { pass } = req.query
  if (pass !== NAP_STATS_PASSWORD) return res.status(401).send('Unauthorized')

  // Begin preloading num_votes
  const election = firebase.firestore().collection('elections').doc(election_id).get()

  let includes_passport_proof = 0
  let includes_sms = 0
  //   let includes_sms_and_passport = 0
  let _malformed_link_auths = 0
  const multiple_payloads: Record<number, number> = {}

  type Payload = { created_at: { _seconds: number }; headers: Record<string, string>; req_body: string }
  type ParsedBody = { confirmed_sms?: string; passport_proof?: unknown }

  // 10-digit hexadecimal
  const well_formed_auth_regex = /[a-z0-9]{10}$/

  // Get auth submissions
  const napEntries = (await firebase.firestore().collection('new-american-primary').get()).docs.map((entry) => {
    const id = entry.id
    const data = entry.data()

    // Stop if link auth is malformed
    if (!well_formed_auth_regex.test(id)) return _malformed_link_auths++

    // Count the number of payloads sent for this link_auth
    const num_payloads = data.payloads.length
    if (!multiple_payloads[num_payloads]) multiple_payloads[num_payloads] = 0
    multiple_payloads[num_payloads] += 1

    // Parse the req body
    const bodies = data.payloads.map((payload: Payload) => JSON.parse(payload.req_body))

    // Look for passport proof
    const has_passport_proof = bodies.some((b: ParsedBody) => b.passport_proof)
    if (has_passport_proof) includes_passport_proof++

    // Look for SMS
    const has_sms = bodies.some((b: ParsedBody) => b.confirmed_sms)
    if (has_sms) includes_sms++

    // Both?
    // if (has_passport_proof && has_sms) includes_sms_and_passport++

    // return { bodies, id }
  })

  const { num_votes } = { ...(await election).data() } as { num_votes: number }
  const count = napEntries.length - _malformed_link_auths

  /* eslint-disable perfectionist/sort-objects */
  res.status(200).json({
    // napEntries,
    nap_auth_stats: {
      'total submitted votes': num_votes,
      //   'total auth rows (incl. malformed)': napEntries.length,
      '__malformed link_auths (dev tests)': _malformed_link_auths,

      'good link_auths': {
        count,
        [`count / votes (${num_votes})`]: pct(count / num_votes),

        'has passport_proof': includes_passport_proof,
        'passport / votes': pct(includes_passport_proof / num_votes),

        'has sms': includes_sms,
        'sms / votes': pct(includes_sms / num_votes),

        // 'multiple auth submissions { num_payloads: count }': multiple_payloads,
      },
      //   includes_sms_and_passport,
    },
  })
  /* eslint-enable perfectionist/sort-objects */
}

function pct(num: number) {
  return `${(num * 100).toFixed(1)}%`
}
