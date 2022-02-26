import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { AboveFold } from '../landing-page/AboveFold'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
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
      <Footer />
    </>
  )
}
