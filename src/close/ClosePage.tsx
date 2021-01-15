import { useRouter } from 'next/router'

import { HeaderBar } from '../create/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AuthedContent } from './_AuthedContent'

export const ClosePage = (): JSX.Element => {
  // Grab election parameters from URL
  const { election_id, trustee_auth } = useRouter().query as { election_id?: string; trustee_auth?: string }

  return (
    <>
      <Head title="Unlock Votes" />

      <HeaderBar />
      <main>
        <h1>Anonymizing &amp; Unlocking Votes</h1>
        <p>
          Election ID: <b>{election_id}</b>
          <br />
          Trustee auth: <b>{trustee_auth}</b>
        </p>

        {election_id && trustee_auth && <AuthedContent {...{ election_id, trustee_auth }} />}
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;
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
