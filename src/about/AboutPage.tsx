import { GlobalCSS } from 'src/GlobalCSS'
import { useAnalytics } from 'src/useAnalytics'

import { BlueDivider } from '../_shared/BlueDivider'
import { OldFooter } from '../_shared/OldFooter'
import { Head } from '../Head'
import { AboveFold } from './AboveFold'
import { Content } from './Content'

export const AboutPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="About" />

      <div>
        <AboveFold />
        <a id="research" />
        <Content />
      </div>
      <BlueDivider />
      <OldFooter />

      <GlobalCSS />

      <style jsx>{`
        div {
          padding: 1rem 3rem;
        }
      `}</style>
    </>
  )
}
