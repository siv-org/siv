import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { AddEmailPage } from './AddEmailPage'
import { YOBPage } from './YOBPage'

export const election_ids_for_11chooses = ['1764391039716', '1764646354556']

export const hasCustomAuthFlow = (election_id: string) => {
  if (useRouter().query.passed_email === 'true') return false
  return election_ids_for_11chooses.includes(election_id)
}

export const CustomAuthFlow = ({ auth, election_id }: { auth: string; election_id: string }) => {
  const { query } = useRouter()
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
