import { useContext } from 'react'

import { Context } from '../context'

export default function Plaintext(): JSX.Element {
  const { state } = useContext(Context)

  return (
    <code style={{ color: 'blue', left: '15%', position: 'relative' }}>
      {'{'}
      <br />
      &nbsp;&nbsp;vote_for_mayor: &apos;{state.vote_for_mayor}&apos;,
      <br />
      &nbsp;&nbsp;secret_id: &apos;76cbd63fa94e&apos;
      <br />
      {'}'}
    </code>
  )
}
