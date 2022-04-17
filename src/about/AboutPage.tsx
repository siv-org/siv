import { useAnalytics } from 'src/useAnalytics'

import { AboveFold } from '../_shared/AboveFold'
import { BlueDivider } from '../_shared/BlueDivider'
import { OldFooter } from '../_shared/OldFooter'
import { Head } from '../Head'
import { Content } from './Content'
import { HeaderBar } from './HeaderBar'

export const AboutPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="About">
        <link href="/landing-page/typography.css" rel="stylesheet" />
      </Head>

      <HeaderBar />
      <AboveFold height={49} showButton={false} />
      <a id="research" />
      <Content />
      <BlueDivider />
      <OldFooter />
    </>
  )
}
