import { HeaderBar } from '../create/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Attendees } from './Attendees'
import { MessagingKeys } from './MessagingKeys'
import { Parameters } from './Parameters'
import { PrivateCoefficients } from './PrivateCoefficients'
import { PublicBroadcastValues } from './PublicBroadcastValues'

export const KeyGenerationPage = (): JSX.Element => {
  return (
    <>
      <Head title="Key Generation" />

      <HeaderBar />
      <main>
        <h1>Threshold Key Generation</h1>
        <h4>Election ID: 16121023123</h4>
        <Attendees />
        <Parameters />
        <MessagingKeys />
        <PrivateCoefficients />
        <PublicBroadcastValues />
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
      <GlobalCSS />
    </>
  )
}
