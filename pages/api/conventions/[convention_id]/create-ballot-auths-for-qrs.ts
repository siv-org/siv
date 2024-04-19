import { firebase } from 'api/_services'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

/** Given a convention ID and ballot ID, make sure all the current generated QR Codes for that Convention have matching ballot auth tokens */
export const createBallotAuthsForQrs = async (convention_id: string, ballot_id: string) => {
  // Lookup current QR codes
  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)
  const currentQrs = (await conventionDoc.collection('qr_ids').get()).docs.map((d) => d.data())

  // Create unique ballot auth tokens for each QR code
  return Promise.all(
    currentQrs.map(({ ballot_auths, qr_id }) => {
      const update = { ...ballot_auths }

      // Does it already have one for this ballot?
      if (update[ballot_id]) return

      // Generate the auth
      const newBallotAuthToken = generateAuthToken()
      update[ballot_id] = newBallotAuthToken

      // TODO: Store the ballot auth in the ballot itself

      // Store the new ballot auth on the QR doc
      return conventionDoc.collection('qr_ids').doc(qr_id).update({ ballot_auths: update })
    }),
  )
}
