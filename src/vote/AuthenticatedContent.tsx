import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { CustomAuthFlow, hasCustomAuthFlow } from './auth/11choosesAuth/CustomAuthFlow'
import { Ballot } from './Ballot'
import { ESignScreen } from './esign/ESignScreen'
import { Instructions } from './Instructions'
import { PrivacyProtectorsStatements } from './PrivacyProtectorsStatements'
import { storeElectionInfo } from './storeElectionInfo'
import { SubmitButton } from './SubmitButton'
import { SubmittedScreen } from './submitted/SubmittedScreen'
import { useVoteState } from './vote-state'
import { YourAuthToken } from './YourAuthToken'

export const AuthenticatedContent = ({ auth, election_id }: { auth: string; election_id: string }): JSX.Element => {
  // Initialize local vote state on client
  const [state, dispatch] = useVoteState(`voter-${election_id}-${auth}`)
  const router = useRouter()
  const link_auth_query = router.query.link_auth
  const wasAlreadySubmittedOnPageLoad = useRef(!!state.submitted_at && !!state.link_auth).current

  storeElectionInfo(dispatch, election_id)

  // Keep link_auth in localStorage and restore it on the URL for subsequent visits
  useEffect(() => {
    if (auth !== 'link' || !router.isReady) return

    if (typeof link_auth_query === 'string') {
      if (link_auth_query !== state.link_auth) dispatch({ link_auth: link_auth_query })
      return
    }

    if (!state.link_auth) return
    if (!wasAlreadySubmittedOnPageLoad) return // Restore only on revisit, not during original submission.

    const [path, hash = ''] = router.asPath.split('#')
    const url = new URL(path, window.location.origin)
    url.searchParams.set('link_auth', state.link_auth)
    router.replace(url.pathname + url.search + (hash ? `#${hash}` : ''))
  }, [auth, dispatch, link_auth_query, router, state.link_auth, wasAlreadySubmittedOnPageLoad])

  return (
    <>
      {state.submitted_at ? (
        hasCustomAuthFlow(election_id) ? (
          <CustomAuthFlow {...{ auth, election_id }} />
        ) : state.esignature_requested && !state.esigned_at ? (
          <ESignScreen {...{ auth, dispatch, election_id }} />
        ) : (
          <>
            <Head>
              <title key="title">SIV: Vote Submitted</title>
            </Head>
            <h1>Vote Submitted.</h1>
            <SubmittedScreen {...{ auth, election_id, state }} />
          </>
        )
      ) : (
        <>
          <h1>Cast Your Vote</h1>
          <YourAuthToken {...{ auth, election_id }} />
          <div className="fade-in">
            <Instructions {...{ election_id, state }} />
            <PrivacyProtectorsStatements {...{ state }} />
            <Ballot {...{ dispatch, election_id, state }} />
            <SubmitButton {...{ auth, dispatch, election_id, state }} />
          </div>
        </>
      )}

      <style jsx>{`
        .fade-in {
          animation: fadeIn ease 2s;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
