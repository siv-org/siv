import { useRouter } from 'next/router'
import { NoSsr } from 'src/_shared/NoSsr'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AuthenticatedContent } from './AuthenticatedContent'
import { EnterAuthToken } from './EnterAuthToken'
import { Footer } from './Footer'

export const VotePage = (): JSX.Element => {
  // Grab election parameters from URL
  const { auth, election_id } = useRouter().query as { auth?: string; election_id?: string }

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        <div>
          {election_id &&
            (auth ? (
              <NoSsr>
                <AuthenticatedContent {...{ auth, election_id }} />
              </NoSsr>
            ) : (
              <EnterAuthToken />
            ))}
        </div>

        <Footer />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;

          /* Push footer to bottom */
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          justify-content: space-between;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
