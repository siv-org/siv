import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { AddEmailPage } from './AddEmailPage'
import { ReturnToProvisional } from './Provisional/ReturnToProvisional'
import { YOBPage } from './YOBPage'

export const election_ids_for_11chooses = [
  '1764391039716', // D test
  '1764646354556', // A test
  '1764187291234', // prod
  '1765914034351', // A test: Provisional ballot's Verification Link
]

export const hasCustomAuthFlow = (election_id: string) => {
  const {
    query: { link, passed_email, show },
  } = useRouter()

  // link = provisional ballot
  // non-provisional's are done after email
  if (!link && passed_email === 'true') return false

  // Allow Provisional ballots to get back to their Verification page
  if (show === 'verification') return false

  return election_ids_for_11chooses.includes(election_id)
}

export const CustomAuthFlow = ({ auth, election_id }: { auth: string; election_id: string }) => {
  const { query } = useRouter()
  const { is_withheld, loaded, voterName } = useVoterInfo(auth, election_id)
  const passedYOB = query.passed_yob === 'true'

  if (auth === 'link') return <ReturnToProvisional {...{ election_id }} />

  // Build verification link URL
  const verificationUrl = `/election/${election_id}/vote?auth=${auth}${
    query.passed_yob ? `&passed_yob=${query.passed_yob}` : ''
  }${query.passed_email ? `&passed_email=${query.passed_email}` : ''}&show=verification`

  return (
    <div className="text-center">
      <div className="mb-6">
        <a className="text-lg font-semibold text-blue-700 hover:underline" href={verificationUrl}>
          Your Verification Info
        </a>
      </div>
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

export type VoterInfo = {
  is_withheld: boolean
  passed_email: boolean
  passed_yob: boolean
  voterName: string
}

/** Query server for voter info, via `auth_token` */
function useVoterInfo(auth: string, election_id: string) {
  const router = useRouter()

  const [voterInfo, setVoterInfo] = useState<VoterInfo & { loaded: boolean }>({
    is_withheld: false,
    loaded: false,
    passed_email: false,
    passed_yob: false,
    voterName: '',
  })

  useEffect(() => {
    async function getVoterInfo() {
      if (auth === 'link') return
      if (!router) return
      const response = await api(`11-chooses/get-voter-auth`, { auth_token: auth, election_id })
      if (!response.ok) {
        console.error('Failed to get voter info:', JSON.stringify(response))
        return alert('Failed to get voter info:' + JSON.stringify(response))
      }

      const voterInfoFromServer: VoterInfo = await response.json()
      const { passed_email, passed_yob } = voterInfoFromServer

      // If server says they've already passed YoB or submitted email, reflect that in URL params
      // so the rest of the flow behaves as if they just completed those steps.
      const updates: string[] = []
      if (passed_yob && !router.asPath.includes('passed_yob=true')) updates.push('passed_yob=true')
      if (passed_email && !router.asPath.includes('passed_email=true')) updates.push('passed_email=true')

      if (updates.length) {
        const separator = router.asPath.includes('?') ? '&' : '?'
        const extraParams = updates.join('&')
        router.replace(`${router.asPath}${separator}${extraParams}`)
      }

      setVoterInfo({ loaded: true, ...voterInfoFromServer })
    }
    getVoterInfo()
  }, [auth, election_id, router])

  return voterInfo
}
