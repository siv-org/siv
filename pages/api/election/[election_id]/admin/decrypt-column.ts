import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { RP, safePointToString } from 'src/crypto/curve'
import { decrypt } from 'src/crypto/decrypt'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { column, decryption_key } = req.body

  // Decrypt the column
  const decryptedColumn = decryptColumn(column, decryption_key)

  return res.status(200).json({ decryptedColumn })
}

export const decryptColumn = (column: CipherStrings[], decryption_key: string) =>
  column.map((cipher) => safePointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))))
