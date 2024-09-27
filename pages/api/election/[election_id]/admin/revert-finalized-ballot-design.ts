import { firebase, pushover } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Confirm no votes cast yet
  if (jwt.num_votes > 0)
    return res.status(400).json({
      message: "Can't revert finalized ballot-design once any votes have been cast",
      num_votes: jwt.num_votes,
    })

  // We may want even stronger automated accountability here to be extra sure election admins aren't maliciously flipping ballot designs in misleading ways. See https://github.com/siv-org/siv/issues/85 and https://github.com/siv-org/siv/pull/251

  // Short-term mitigation before other checks are in place:
  // Notify server admin this feature is being used
  await pushover(
    `SIV: ${jwt.election_manager} reverted finalized ballot-design`,
    `${election_id}: ${jwt.election_title}`,
  )

  // Update election in db
  await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .update({
      ballot_design_finalized: false, // Unset

      // Store the previously-finalized version, to ensure this feature isn't being used maliciously
      reverted_finalized_ballot_designs: firestore.FieldValue.arrayUnion({
        previous_ballot_design: jwt.ballot_design,
        reverted_at: new Date(),
      }),
    })

  return res.status(201).json({ message: 'Reverted finalized ballot design' })
}
