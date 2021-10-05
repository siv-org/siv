import { GlobalCSS } from 'src/GlobalCSS'

import { Mixnet } from './Mixnet/Mixnet'

export const OnlyMixnet = () => {
  return (
    <div>
      <Mixnet />
      <GlobalCSS />
      <style jsx>{`
        div {
          padding: 3rem;
        }
      `}</style>
    </div>
  )
}
