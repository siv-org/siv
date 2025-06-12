import Contributors from './contributors.mdx'
import { HeaderBar } from '../homepage/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'

export const ContributorsPage = () => {
  return (
    <>
      <GlobalCSS />
      <HeaderBar />
      <div className="m-10">
        <Contributors />
      </div>
    </>
  )
}
