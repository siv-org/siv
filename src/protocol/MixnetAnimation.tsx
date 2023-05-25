import { Animation } from 'src/status/Mixnet/Animation'
import { range } from 'src/utils'

export const MixnetAnimation = () => (
  <Animation protocolPage observers={range(1, 6).map((i) => `Privacy Protector #${i}`)} />
)
