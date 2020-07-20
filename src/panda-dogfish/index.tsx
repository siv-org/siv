import Head from 'next/head'

import { AboveFold } from './AboveFold'
import { BlueDivider } from './BlueDivider'
import { ForGovernments } from './ForGovernments'
import { JumboVoteImage } from './JumboVoteImage'
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
    </main>
  </>
)
