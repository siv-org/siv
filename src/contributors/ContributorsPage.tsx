import { HeaderBar } from '../homepage/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'

import { Contributors } from './Contributors'

export const ContributorsPage = () => {
  return (
    <>
      <GlobalCSS />
      <HeaderBar />

      <Contributors />
    </>
  )
}
