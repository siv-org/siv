import Head from 'next/head'

import { AboveFold } from './AboveFold'
import { BlueDivider } from './BlueDivider'
import { BuiltUpon } from './BuiltUpon'
import { Footer } from './Footer'
import { ForGovernments } from './ForGovernments'
import { HeaderBar } from './HeaderBar'
import { LetYourGovtKnow } from './LetYourGovtKnow'
import { NowPossible } from './NowPossible'
import { SIVFeatures } from './SIVFeatures'
import { WeCanDoBetter } from './WeCanDoBetter'
import { WhereAreWe } from './WhereAreWe'

const title = `SIV: Secure Internet Voting`
const card_image = `https://secureinternetvoting.org/preview.png`

export const LandingPage = (): JSX.Element => (
  <>
    <Head>
      <title>{title}</title>
      <link href="/favicon.png" rel="icon" />
      <link href="/landing-page/typography.css" rel="stylesheet" />
      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      <meta content={card_image} property="og:image" />
      <meta content={title} property="og:title" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@dsernst" name="twitter:creator" />
      <meta content={title} name="twitter:title" />
      <meta content={card_image} name="twitter:image" />
    </Head>

    <main>
      <HeaderBar />
      <AboveFold />
      <WhereAreWe />
      <WeCanDoBetter />
      <NowPossible />
      <BlueDivider />
      <SIVFeatures />
      <BlueDivider />
      <ForGovernments />
      <BuiltUpon />
      <LetYourGovtKnow idKey="2" />
      <BlueDivider />
      <Footer />
    </main>
  </>
)
