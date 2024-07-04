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
  const [openedRegistration, setOpenedRegistration] = useState(false)

  // If Registrations allowed, default to opening those, otherwise default to opening Auth Token input.
  useEffect(() => {
    setOpenedVoterAuthInput(!voter_applications_allowed)
    setOpenedRegistration(!!voter_applications_allowed)
  }, [voter_applications_allowed])

  if (!loaded)
    return (
      <h2>
        <Spinner />
        Loading...
      </h2>
    )

  function EnterAuth() {
    return (
      <div className="max-w-[350px] mx-auto">
        {voter_applications_allowed ? (
          <div>
            <OnClickButton
              style={{ margin: 0, padding: '10px 15px' }}
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
    )
  }

  function Or() {
    return <h2 className="my-12 italic font-medium opacity-70">— &nbsp; or &nbsp; —</h2>
  }

  function EnterRegistrationInfo() {
    return (
      <div>
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
    )
  }

  return (
    <div className="text-center">
      <h1>{election_title}</h1>

      {!voter_applications_allowed ? (
        <>
          <EnterAuth />
          <Or />
          <EnterRegistrationInfo />
        </>
      ) : (
        <>
          <EnterRegistrationInfo />
          <Or />
          <EnterAuth />
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
