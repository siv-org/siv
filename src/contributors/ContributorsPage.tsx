import dynamic from 'next/dynamic'
import { HeaderBar } from '../homepage/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'

const Contributors = dynamic(() => import('./contributors.mdx'), { ssr: false })

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
