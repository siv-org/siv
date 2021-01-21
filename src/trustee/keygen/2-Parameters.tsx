import { big } from '../../crypto/types'
import { State } from '../trustee-state'

export const Parameters = ({ state }: { state: State }) => {
  if (!state.parameters) return <></>

  const n = state.trustees?.length
  const t = state.parameters.t

  return (
    <>
      <h3>II. Parameters:</h3>
      <p>
        The goal is to generate a {t} of {n} threshold key (<i>t</i> = {t}, <i>n</i> = {n})
      </p>
      <ul>
        <li>
          Prime <i>p</i> = {state.parameters.p} ({big(state.parameters.p).bitLength()} bits)
        </li>
        <li>
          Prime <i>q</i> = {state.parameters.q}
        </li>
        <li>
          Generator <i>g</i> = {state.parameters.g}
        </li>
      </ul>
    </>
  )
}
