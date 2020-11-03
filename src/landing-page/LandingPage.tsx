import { Head } from '../Head'
import { AboveFold } from './AboveFold'
import { BlueDivider } from './BlueDivider'
import { BuiltUpon } from './BuiltUpon'
import { Footer } from './Footer'
import { ForGovernments } from './ForGovernments'
import { HeaderBar } from './HeaderBar'
import { LetYourGovtKnow } from './LetYourGovtKnow'
import { NowPossible } from './NowPossible'
import { SIVFeatures } from './SIVFeatures'
import { WhereAreWe } from './WhereAreWe'

export const LandingPage = (): JSX.Element => (
  <>
    <Head title="Secure Internet Voting">
      <link href="/landing-page/typography.css" rel="stylesheet" />
    </Head>

    <main>
      <HeaderBar />
      <AboveFold />
      <WhereAreWe />
      <BlueDivider />
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
