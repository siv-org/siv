import { ElectionInfo } from 'api/election/[election_id]/info'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Spinner } from 'src/admin/Spinner'

import { OnClickButton } from '../_shared/Button'
import { EnterAuthToken } from './EnterAuthToken'
import { VoterRegistrationForm } from './VoterRegistrationForm'

export const NoAuthTokenScreen = () => {
  const { election_title, loaded, voter_applications_allowed } = useElectionInfo()
  const [openedVoterAuthInput, setOpenedVoterAuthInput] = useState(false)
  useEffect(() => setOpenedVoterAuthInput(!voter_applications_allowed), [voter_applications_allowed])

  const [openedRegistration, setOpenedRegistration] = useState(false)

  if (!loaded)
    return (
      <h2>
        <Spinner />
        Loading...
      </h2>
    )

  return (
    <div>
      <h1 className="text-center">{election_title}</h1>
      <div className="max-w-[350px] mx-auto">
        <h2 className="text-center">To cast a vote...</h2>
        {voter_applications_allowed ? (
          <div style={{ textAlign: 'center' }}>
            <OnClickButton
              style={{ margin: 0, marginTop: 20, padding: '10px 15px' }}
              onClick={() => setOpenedVoterAuthInput(!openedVoterAuthInput)}
            >
              Enter your Voter Authorization Token
            </OnClickButton>
          </div>
        ) : (
          <p>Enter your Voter Authorization Token:</p>
        )}

        {openedVoterAuthInput && <EnterAuthToken />}
      </div>

      <div className="text-center">
        <h2 className="my-12 italic font-medium opacity-70">— &nbsp; or &nbsp; —</h2>

        <OnClickButton
          style={{ margin: 0, padding: '10px 15px' }}
          onClick={() => setOpenedRegistration(!openedRegistration)}
        >
          Enter Your Info To Join Election
        </OnClickButton>
        {!voter_applications_allowed && (
          <p className="italic font-semibold text-rose-700">
            This election is not accepting new voter registrations at this time.
          </p>
        )}
        {openedRegistration && voter_applications_allowed && <VoterRegistrationForm />}
      </div>
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
