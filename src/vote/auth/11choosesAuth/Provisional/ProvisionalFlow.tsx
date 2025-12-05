import { useRouter } from 'next/router'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { Footer } from 'src/vote/Footer'

import { AddEmailPage } from '../AddEmailPage'
import { BackupAuthOptions } from './BackupAuthOptions'
import { VoterRegistrationLookupScreen } from './VoterRegistrationLookupScreen'

export const ProvisionalFlow = () => {
  const {
    election_id,
    link: link_auth,
    passed_email,
    submitted_reg_info,
  } = useRouter().query as { election_id?: string; link?: string; passed_email?: string; submitted_reg_info?: string }

  if (!election_id) return <div className="animate-pulse">Loading Election ID...</div>
  if (!link_auth) return <div className="animate-pulse">Loading Link Auth...</div>

  return (
    <main className="max-w-[750px] w-full mx-auto p-4 flex flex-col min-h-screen justify-between text-center">
      <Head title="Provisional Ballot Auth" />

      {passed_email !== 'true' ? (
        <AddEmailPage auth="provisional" {...{ election_id, link_auth }} />
      ) : submitted_reg_info !== 'true' ? (
        <VoterRegistrationLookupScreen {...{ election_id, link_auth }} />
      ) : (
        <BackupAuthOptions {...{ election_id, link_auth }} />
      )}

      <Footer />
      <TailwindPreflight />
    </main>
  )
}
