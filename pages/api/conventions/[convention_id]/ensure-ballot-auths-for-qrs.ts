import { firebase, pushover } from 'api/_services'
import { addVotersToElection } from 'api/election/[election_id]/admin/add-voters'

import { QR_Id } from './create-qrs'

const qrToEmail = (convention_id: string) => (qr: QR_Id) => `${qr.index}.${qr.qr_id}@convention.${convention_id}`

/** Make sure all the current QR Codes for a Convention have matching ballot auth tokens for the active redirect
 *  Optionally pass in `election_id` if already known, to skip loading it
 */
export const ensureBallotAuthsForQrs = async (convention_id: string, known_election_id?: string) => {
  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)

  let ballot_id = known_election_id
  if (ballot_id === undefined) {
    // Lookup active redirect
    const { active_redirect } = (await conventionDoc.get()).data() as { active_redirect?: string }
    ballot_id = active_redirect
  }

  // Stop if no active redirect
  if (!ballot_id || ballot_id === '') return

  // Lookup current QR codes
  const currentQrs = (await conventionDoc.collection('qr_ids').get()).docs.map((d) => d.data() as QR_Id)

  // Filter out only those that need new ballot auths
  const needsNewAuth = currentQrs.filter((q) => !(q.ballot_auths || {})[ballot_id])
  console.log('createBallotAuthsForQrs', { 'New auths needed': needsNewAuth.length, ballot_id, convention_id })

  if (!needsNewAuth.length) return

  // Generate unique emails for each QR
  const newEmails = needsNewAuth.map(qrToEmail(convention_id))

  // Create and store unique ballot auth tokens for each
  const { already_added, email_to_auth, unique_new_emails } = await addVotersToElection(newEmails, ballot_id)
  // Edge case if ballot already saw email, but the ballot_auth wasn't stored on QR_Id doc.
  if (already_added.length > 0) {
    console.log('Unexpected error! Already added:', already_added)
    pushover('Unexpected convention error creating ballot auths', `Already added: ${already_added.join(', ')}`)
  }

  // To convert unique_new_emails back to QR objects
  const emailToQR = needsNewAuth.reduce(
    (memo, q) => ({ ...memo, [qrToEmail(convention_id)(q)]: q }),
    {} as Record<string, QR_Id>,
  )

  // Store all the new auth tokens
  await Promise.all(
    unique_new_emails.map((email: string) => {
      const qr = emailToQR[email]
      const update = { ...qr.ballot_auths, [ballot_id]: email_to_auth[email] }
      return conventionDoc.collection('qr_ids').doc(qr.qr_id).update({ ballot_auths: update })
    }),
  )
}
