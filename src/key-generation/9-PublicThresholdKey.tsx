import { State } from './useKeyGenState'

export const PublicThresholdKey = ({ state }: { state: State }) => {
  if (state.start !== true) {
    return <></>
  }
  return (
    <>
      <h3>IX. Public Threshold Key:</h3>
      <p>
        Anyone can calculate the generated Public Key as the product of all broadcasts A<sub>0</sub> % p.
      </p>
      <p>Public key = 5 * 49 * 17 % 57 ≡ 4</p>
      <br />
      <h3>All done. 🎉</h3>
    </>
  )
}
