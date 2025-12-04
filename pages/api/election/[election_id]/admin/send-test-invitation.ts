import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from '../../../_services'
import { buildSubject, send_invitation_email } from '../../../invite-voters'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  try {
    // Lookup election title and custom invitation text
    const electionDoc = firebase.firestore().collection('elections').doc(election_id)
    const electionData = await electionDoc.get()

    if (!electionData.exists) return res.status(404).json({ error: 'Election not found' })

    const { custom_email_headerbar, custom_invitation_text, election_manager, election_title } =
      electionData.data() as {
        custom_email_headerbar?: string
        custom_invitation_text?: string
        election_manager?: string
        election_title?: string
      }

    // Create a test auth token (10 characters, hex)
    const testAuthToken = '1a2b3c4d5e'
    const testLink = `${req.headers.origin}/election/${election_id}/vote?auth=${testAuthToken}`

    // Send test invitation email to the admin
    const result = await send_invitation_email({
      custom_email_headerbar,
      custom_text: custom_invitation_text,
      from: election_manager,
      link: testLink,
      subject_line: `[TEST ${new Date().toTimeString().slice(0, 5)}] ${buildSubject(election_title)}`,
      tag: `test-invite-${election_id}`,
      voter: jwt.email, // Send to the admin who requested the test
    })

    console.log(`Test invitation sent to admin ${jwt.email} for election ${election_id}:`, result)

    return res.status(200).json({
      message: 'Test invitation email sent successfully',
      recipient: jwt.email,
      result,
      success: true,
    })
  } catch (error) {
    console.error('Error sending test invitation:', error)
    return res.status(500).json({
      details: error instanceof Error ? error.message : String(error),
      error: 'Failed to send test invitation email',
    })
  }
}
