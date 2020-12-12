import { State } from './useKeyGenState'

export const Parameters = ({ state }: { state: State }) => {
  const n = state.trustees.length
  const t = state.trustees.length

  return (
    <>
      <h3>II. Parameters:</h3>
      <p>
        The goal is to generate a {t} of {n} threshold key (<i>t</i> = {t}, <i>n</i> = {n})
      </p>
      <ul>
        <li>
          Prime <i>p</i> = 57
        </li>
        <li>
          Prime <i>q</i> = 29
        </li>
        <li>
          Generator <i>g</i> = 4
        </li>
      </ul>
    </>
  )
}
