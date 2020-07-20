import Head from 'next/head'

import { AboveFold } from './AboveFold'
import { BlueDivider } from './BlueDivider'
import { BuiltUpon } from './BuiltUpon'
import { Footer } from './Footer'
import { ForGovernments } from './ForGovernments'
import { JumboVoteImage } from './JumboVoteImage'
import { LetYourGovtKnow } from './LetYourGovtKnow'
import { NowPossible } from './NowPossible'
import { SIVFeatures } from './SIVFeatures'
import { WeCanDoBetter } from './WeCanDoBetter'
import { WhereAreWe } from './WhereAreWe'

export const PandaDogfish = (): JSX.Element => (
  <>
    <Head>
      <title>SIV: Secure Internet Voting</title>
      <link href="/favicon.png" rel="icon" />
      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>

    <main>
      <AboveFold />
      <WhereAreWe />
      <WeCanDoBetter />
      <NowPossible />
      <JumboVoteImage />
      <SIVFeatures />
      <BlueDivider />
      <ForGovernments />
      <BuiltUpon />
      <LetYourGovtKnow />
      <BlueDivider />
      <Footer />
    </main>

    <style global jsx>{`
      body {
        font-family: 'proxima-nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }

      h1 {
        font-size: calc(3.6vw + 1rem);
      }
    `}</style>
  </>
)
