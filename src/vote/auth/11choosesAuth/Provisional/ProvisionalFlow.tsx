import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { Footer } from 'src/vote/Footer'

import { AddEmailPage } from '../AddEmailPage'
import { BackupAuthOptions } from './BackupAuthOptions'
import { VoterRegistrationLookupScreen } from './VoterRegistrationLookupScreen'

type ProvisionalStage = 'email_submitted' | 'vote_submitted' | 'voter_reg_submitted'

export const ProvisionalFlow = () => {
  const {
    election_id,
    link: link_auth,
    passed_email,
    submitted_reg_info,
  } = useRouter().query as { election_id?: string; link?: string; passed_email?: string; submitted_reg_info?: string }

  const [loadingStatus, setLoadingStatus] = useState(true)
  const [stage, setStage] = useState<ProvisionalStage>('vote_submitted')

  useEffect(() => {
    if (!election_id || !link_auth) return

    let cancelled = false
    ;(async () => {
      setLoadingStatus(true)
      try {
        const response = await api('/11-chooses/provisional/get-status', { election_id, link_auth })
        if (!response.ok) {
          // fall back to default stage logic
          return
        }
        const json = (await response.json()) as { stage: ProvisionalStage; status: 'ok' } | { status: 'not_found' }
        if (!cancelled && json.status === 'ok') {
          setStage(json.stage)
        }
      } catch {
        // ignore errors and fall back to default
      } finally {
        if (!cancelled) setLoadingStatus(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [election_id, link_auth])

  if (!election_id) return <div className="animate-pulse">Loading Election ID...</div>
  if (!link_auth) return <div className="animate-pulse">Loading Link Auth...</div>

  const emailComplete = passed_email === 'true' || stage === 'email_submitted' || stage === 'voter_reg_submitted'
  const voterRegComplete = submitted_reg_info === 'true' || stage === 'voter_reg_submitted'

  return (
    <main className="max-w-[750px] w-full mx-auto p-4 flex flex-col min-h-screen justify-between text-center">
      <Head title="Provisional Ballot Auth" />

      {loadingStatus && (
        <p className="mt-4 text-lg italic text-black/50 animate-pulse">Loading your provisional status...</p>
      )}

      {!loadingStatus &&
        (!emailComplete ? (
          <AddEmailPage auth="provisional" {...{ election_id, link_auth }} />
        ) : !voterRegComplete ? (
          <VoterRegistrationLookupScreen {...{ election_id, link_auth }} />
        ) : (
          <BackupAuthOptions {...{ election_id, link_auth }} />
        ))}

      <Footer />
      <TailwindPreflight />
    </main>
  )
}
