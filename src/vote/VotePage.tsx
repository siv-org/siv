import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { GlobalCSS } from '../GlobalCSS'
import { AuthenticatedContent } from './AuthenticatedContent'
import { ElectionMetaTags } from './ElectionMetaTags'
import { Footer } from './Footer'
import { NoAuthTokenScreen } from './NoAuthTokenScreen'

interface ElectionData {
  ballot_design?: Array<{ options: Array<{ name: string }>; title: string }>
  election_title?: string
}

interface VotePageProps {
  electionData?: ElectionData
}

export const VotePage = ({ electionData: serverElectionData }: VotePageProps): JSX.Element => {
  // Grab election parameters from URL
  const { auth, election_id } = useRouter().query as { auth?: string; election_id?: string }
  const [electionData, setElectionData] = useState<ElectionData>(serverElectionData || {})

  // Fetch election data for meta tags (fallback if server-side data is missing)
  useEffect(() => {
    if (!election_id || serverElectionData?.election_title) return

    // Use the current domain for the API call
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

    fetch(`${baseUrl}/api/election/${election_id}/info`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setElectionData({
            ballot_design: data.ballot_design,
            election_title: data.election_title,
          })
        }
      })
      .catch((err) => console.error('Failed to fetch election data for meta tags:', err))
  }, [election_id, serverElectionData])

  return (
    <>
      {/* Election-specific meta tags for OG image */}
      <ElectionMetaTags
        ballot_design={electionData.ballot_design}
        election_id={election_id}
        election_title={electionData.election_title}
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
