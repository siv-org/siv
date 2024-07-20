import { ElectionInfo } from 'api/election/[election_id]/info'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Button } from '../_shared/Button'
import { EnterAuthToken } from './EnterAuthToken'

export const NoAuthTokenScreen = () => {
  const { election_title, loaded, voter_applications_allowed } = useElectionInfo()

  return (
    <div className="text-center">
      {/* Election title */}
      <h1>
        {!loaded ? <i className="text-lg text-gray-300 animate-pulse">Loading election title...</i> : election_title}
      </h1>

      {/* Enter Auth Token */}
      <div className="max-w-[350px] mx-auto">
        <div>
          <h3>Enter your Voter Authorization Token</h3>
        </div>

        <EnterAuthToken />
      </div>

      {/* Or... link to Vote-then-Auth */}
      {voter_applications_allowed && (
        <>
          {/* Or */}
          <h2 className="my-12 italic font-medium opacity-70">— &nbsp; or &nbsp; —</h2>

          {/* Button link to /vote?auth=link */}
          <div>
            <Button href={`${window.location.href}?auth=link`} style={{ margin: 0, padding: '10px 15px' }}>
              Vote then Authenticate
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function useElectionInfo() {
  const { election_id } = useRouter().query
  const [info, setInfo] = useState<ElectionInfo & { loaded: boolean }>({ loaded: false })
  useEffect(() => {
    async function getElectionInfo() {
      const response = await fetch(`/api/election/${election_id}/info`)

      setInfo({ ...(await response.json()), loaded: true })
    }
    if (!election_id) return
    getElectionInfo()
  }, [election_id])
  return info
}
