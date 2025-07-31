import { NoSsr } from 'src/_shared/NoSsr'
import { Head } from 'src/Head'

import { GlobalCSS } from '../GlobalCSS'
import { AuthenticatedContent } from './AuthenticatedContent'
import { Footer } from './Footer'
import { NoAuthTokenScreen } from './NoAuthTokenScreen'

const baseUrl = 'https://siv.org'

export const VotePage = ({
  query: { auth, election_id },
}: {
  query: { auth?: string; election_id: string }
}): JSX.Element => {
  return (
    <>
      {/* Ballot-specific meta tags for link previews */}
      <Head
        description="Private verifiable voting"
        image_preview_url={`${baseUrl}/api/election/${election_id}/og-image`}
        title="Cast Your Vote"
      />

      <main>
        <div>
          {election_id &&
            (auth ? (
              <NoSsr>
                <AuthenticatedContent {...{ auth, election_id }} />
              </NoSsr>
            ) : (
              <NoAuthTokenScreen />
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
