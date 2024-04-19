import { firebase } from 'api/_services'

/** Given a convention ID and ballot ID, make sure all the current generated QR Codes for that Convention have matching ballot auth tokens */
export const createBallotAuthsForQrs = async (convention_id: string, ballot_id: string) => {
  // Lookup current QR codes
  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)
  const currentQrs = (await conventionDoc.collection('qr_ids').get()).docs.map((d) => d.data())

  console.log(ballot_id, currentQrs)

  // Create unique ballot auth tokens for each QR code
  // Store each ballot auth token in QR doc
}
