import { firebase } from 'api/_services'
import { checkJwtOwnsElection } from 'api/validate-admin-jwt'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // TODO: Confirm there are no votes cast already

  // TODO: We probably want better accountability here to be extra sure election admins aren't maliciously flipping ballot designs in misleading ways. See https://github.com/siv-org/siv/issues/85

  // TODO: Notify admin this feature is being used

  // TODO: Store the previously- finalized version, to ensure this feature isn't being used maliciously

  // Unset `ballot_design_finalized` in db
  await firebase.firestore().collection('elections').doc(election_id).update({ ballot_design_finalized: false })

  return res.status(201).json({ message: 'Reverted finalized ballot design' })
}
