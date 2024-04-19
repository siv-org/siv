import { firebase } from 'api/_services'

/** Given a convention ID and ballot ID, make sure all the current generated QR Codes for that Convention have matching ballot auth tokens */
export const createBallotAuthsForQrs = async (convention_id: string, ballot_id: string) => {
  // Lookup current QR codes
  const conventionDoc = firebase.firestore().collection('conventions').doc(convention_id)
  const currentQrs = conventionDoc.collection('qr_ids')

  console.log(currentQrs, ballot_id) // silence warnings,

  // Create unique ballot auth tokens for each QR code
  // Store each ballot auth token in QR doc
}
