import { Switch } from '@material-ui/core'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const ToggleRegistration = () => {
  const [updating, setUpdating] = useState(false)
  const { election_id, voter_applications_allowed } = useStored()

  async function toggleVoterApplications() {
    setUpdating(true)
    const response = await api(`election/${election_id}/admin/set-voter-applications-allowed`, {
      voter_applications_allowed: !voter_applications_allowed,
    })

    if (response.status === 201) {
      revalidate(election_id)
      setUpdating(false)
    } else {
      throw await response.json()
    }
  }

  return (
    <section onClick={toggleVoterApplications}>
      <label>
        Enable <i>Voter Registration Link</i>?
      </label>
      <div style={{ bottom: 3, display: 'inline-block', position: 'relative' }}>
        <Switch checked={!!voter_applications_allowed} color="primary" onClick={toggleVoterApplications} />
      </div>
      {updating && <Spinner />}
      <style jsx>{`
        section {
          padding: 5px;
          margin-left: -5px;
        }

        label,
        section {
          cursor: pointer;
        }

        i {
          font-weight: 500;
        }
      `}</style>
    </section>
  )
}
