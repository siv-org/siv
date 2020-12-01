import { NoSsr } from '@material-ui/core'
import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AuthenticatedContent } from './AuthenticatedContent'
import { Footer } from './Footer'

export const VotePage = (): JSX.Element => {
  // Grab election parameters from URL
  const { auth, election_id } = useRouter().query as { auth?: string; election_id?: string }

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        {election_id && auth && (
          <NoSsr>
            <AuthenticatedContent {...{ auth, election_id }} />
          </NoSsr>
        )}

        <Footer />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
