import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { pointToString, RP } from 'src/crypto/curve'
import { decrypt } from 'src/crypto/decrypt'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { column, decryption_key } = req.body

  // Decrypt the column
  const decryptedColumn = column.map((cipher: CipherStrings) =>
    pointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))),
  )

  res.status(200).json({ decryptedColumn })
}
