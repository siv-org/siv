import { useRouter } from 'next/router'

import { HeaderBar } from '../create/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Attendees } from './Attendees'
import { CalculatePrivateKeyshare } from './CalculatePrivateKeyshare'
import { MessagingKeys } from './MessagingKeys'
import { PairwiseShares } from './PairwiseShares'
import { Parameters } from './Parameters'
import { PrivateCoefficients } from './PrivateCoefficients'
import { PublicBroadcastValues } from './PublicBroadcastValues'
import { PublicThresholdKey } from './PublicThresholdKey'
import { VerifyShares } from './VerifyShares'

export const KeyGenerationPage = (): JSX.Element => {
  // Grab election parameters from URL
  const { auth, election_id } = useRouter().query as { auth?: string; election_id?: string }

  return (
    <>
      <Head title="Key Generation" />

      <HeaderBar />
      <main>
        <h1>Threshold Key Generation</h1>
        <h4>Election ID: {election_id}</h4>
        <Attendees />
        <Parameters />
        <MessagingKeys />
        <PrivateCoefficients />
        <PublicBroadcastValues />
        <PairwiseShares />
        <VerifyShares />
        <CalculatePrivateKeyshare />
        <PublicThresholdKey />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          margin-top: 0;
          font-size: 22px;
        }

        h2 {
          font-size: 18px;
        }
      `}</style>
      <style global jsx>{`
        h3 {
          margin-top: 2.5rem;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
