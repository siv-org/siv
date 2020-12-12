import { useRouter } from 'next/router'

import { HeaderBar } from '../create/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AuthenticatedContent } from './AuthenticatedContent'

export const KeyGenerationPage = (): JSX.Element => {
  // Grab election parameters from URL
  const { election_id, trustee_auth } = useRouter().query as { election_id?: string; trustee_auth?: string }

  return (
    <>
      <Head title="Key Generation" />

      <HeaderBar />
      <main>
        <h1>Threshold Key Generation</h1>
        <p>
          Election ID: <b>{election_id}</b>
        </p>
        {election_id && trustee_auth && <AuthenticatedContent {...{ election_id, trustee_auth }} />}
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
