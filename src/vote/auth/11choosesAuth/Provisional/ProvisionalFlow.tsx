import { useRouter } from 'next/router'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { Footer } from 'src/vote/Footer'

import { AddEmailPage } from '../AddEmailPage'
import { ProvisionalAuthOptions } from './ProvisionalAuthOptions'
// import { ProvisionalSubmitted } from './ProvisionalSubmitted'
import { VoterRegistrationLookupScreen } from './VoterRegistrationLookupScreen'

export const ProvisionalFlow = () => {
  const router = useRouter()
  const {
    election_id,
    // finish,
    link: link_auth,
    passed_email,
    submitted_reg_info,
  } = router.query as {
    election_id?: string
    finish?: string
    link?: string
    passed_email?: string
    submitted_reg_info?: string
  }

  if (!election_id) return <div className="animate-pulse">Loading Election ID...</div>
  if (!link_auth) return <div className="animate-pulse">Loading Link Auth...</div>

  // Build verification link URL
  const verificationUrl = `/election/${election_id}/vote?auth=${link_auth}${
    passed_email ? `&passed_email=${passed_email}` : ''
  }${submitted_reg_info ? `&submitted_reg_info=${submitted_reg_info}` : ''}&show=verification`

  return (
    <main className="max-w-[750px] w-full mx-auto p-4 flex flex-col min-h-screen justify-between text-center">
      <Head title="Provisional Ballot Auth" />

      <div className="mb-6">
        <a className="text-lg font-semibold text-blue-700 hover:underline" href={verificationUrl}>
          Your Verification Info
        </a>
      </div>

      {passed_email !== 'true' ? (
        <AddEmailPage auth="provisional" {...{ election_id, link_auth }} />
      ) : submitted_reg_info !== 'true' ? (
        <VoterRegistrationLookupScreen {...{ election_id, link_auth }} />
      ) : (
        // )
        //   : finish !== 'auth' ? (
        // <ProvisionalSubmitted />
        <ProvisionalAuthOptions {...{ election_id, link_auth }} />
      )}

      <Footer />
      <TailwindPreflight />
    </main>
  )
}
