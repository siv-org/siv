import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { AddEmailPage } from './AddEmailPage'
import { ProvisionalReturnScreen } from './Provisional/ProvisionalReturnScreen'
import { YOBPage } from './YOBPage'

export const election_ids_for_11chooses = [
  '1764391039716', // D test
  '1764646354556', // A test
  '1764187291234', // prod
]

export const hasCustomAuthFlow = (election_id: string) => {
  const {
    query: { link, passed_email },
  } = useRouter()

  // link = provisional ballot
  // non-provisional's are done after email
  if (!link && passed_email === 'true') return false
  return election_ids_for_11chooses.includes(election_id)
}

export const CustomAuthFlow = ({ auth, election_id }: { auth: string; election_id: string }) => {
  const { query } = useRouter()

  // When auth==='link', this is a provisional ballot that has already been submitted.
  // Instead of trying to look up voter info (which is not supported for auth='link'),
  // show a special flow that lets the voter continue their existing provisional ballot
  // or start a new one.
  if (auth === 'link') {
    return (
      <div className="text-center">
        <ProvisionalReturnScreen election_id={election_id} />
        <TailwindPreflight />
      </div>
    )
  }

  const { is_withheld, loaded, voterName } = useVoterInfo(auth, election_id)
  const passedYOB = query.passed_yob === 'true'

  return (
    <div className="text-center">
      {!loaded ? (
        // Loading voter info
        <p className="mt-8 text-lg italic animate-pulse text-black/50">Loading voter info...</p>
      ) : !passedYOB ? (
        // First auth page
        <YOBPage {...{ auth, election_id, is_withheld, voterName }} />
      ) : (
        // Add email Page
        <AddEmailPage {...{ auth, election_id }} />
      )}

      <TailwindPreflight />
    </div>
  )
}

export type VoterInfo = { is_withheld: boolean; voterName: string }
/** Query server for voter info, via `auth_token` */
function useVoterInfo(auth: string, election_id: string) {
  const [voterInfo, setVoterInfo] = useState<VoterInfo & { loaded: boolean }>({
    is_withheld: false,
    loaded: false,
    voterName: '',
  })

  useEffect(() => {
    async function getVoterInfo() {
      if (auth === 'link') return
      const response = await api(`11-chooses/get-voter-auth`, { auth_token: auth, election_id })
      if (!response.ok) {
        console.error('Failed to get voter info:', JSON.stringify(response))
        return alert('Failed to get voter info:' + JSON.stringify(response))
      }

      const voterInfo = await response.json()
      // console.log({ voterInfo })
      setVoterInfo({ loaded: true, ...voterInfo })
    }
    getVoterInfo()
  }, [auth])

  return voterInfo
}
