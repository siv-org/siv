import { useEffect } from 'react'

// import decrypt from '../crypto/decrypt'
import { StateAndDispatch } from './keygen-state'
import { PrivateBox } from './PrivateBox'

export const ReceivedPairwiseShares = ({ dispatch, state }: StateAndDispatch) => {
  const { pairwise_shares: shares, parameters, private_coefficients: coeffs, trustees } = state
  const trustees_w_commitments = trustees?.filter((t) => t.commitments).length

  // Runs once, after all commitments have been broadcast
  useEffect(() => {
    // Need these before we begin
    if (!parameters || !trustees || shares) return
  }, [coeffs, trustees_w_commitments])

  if (!trustees || !coeffs || trustees_w_commitments !== trustees.length) {
    return <></>
  }

  const own_index = trustees.find((t) => t.you)!.index

  return (
    <>
      <h3>VII. Received Pairwise Shares:</h3>
      <p>Decrypt the shares intended for you.</p>
      <PrivateBox>
        <ol>
          {trustees.map(({ email, encrypted_pairwise_shares, you }) => (
            <li key={email}>
              {you ? (
                <>Your own share is {shares ? shares[own_index] : '...'}.</>
              ) : (
                <>
                  {email} sent you encrypted share {convertToRoman(own_index + 1).toLowerCase()}.{' '}
                  {encrypted_pairwise_shares[own_index]}.
                  <br />
                  Your private key {state.personal_key_pair?.decryption_key} decrypts this into: ...
                </>
              )}
            </li>
          ))}
        </ol>
      </PrivateBox>
      <style jsx>{`
        li {
          margin-bottom: 15px;
        }
      `}</style>
    </>
  )
}

// adapted from https://stackoverflow.com/a/41358305
function convertToRoman(num: number) {
  const roman: Record<string, number> = {
    C: 100,
    CD: 400,
    CM: 900,
    D: 500,
    I: 1,
    IV: 4,
    IX: 9,
    L: 50,
    M: 1000,
    V: 5,
    X: 10,
    XC: 90,
    XL: 40,
  }
  let str = ''

  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i])
    num -= q * roman[i]
    str += i.repeat(q)
  }

  return str
}
