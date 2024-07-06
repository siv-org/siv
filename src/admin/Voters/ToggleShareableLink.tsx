import { UsergroupAddOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Switch } from '../BallotDesign/Switch'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const ToggleShareableLink = () => {
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
    <section className="p-1 ml-[-5px]">
      <label className="cursor-pointer" onClick={toggleVoterApplications}>
        <UsergroupAddOutlined className="text-[20px] mr-1.5" />
        Allow new voters to join via link?
      </label>
      <span className="relative bottom-[3px] ml-2">
        <Switch checked={!!voter_applications_allowed} label="" onClick={toggleVoterApplications} />
      </span>
      {updating && <Spinner />}

      {voter_applications_allowed && (
        <div className="mt-1 mb-5">
          <span className="text-xs opacity-90">Shareable link:</span>{' '}
          <a href={`/election/${election_id}/vote?auth=link`} rel="noreferrer" target="_blank">
            {window.location.origin}/election/{election_id}/vote?auth=link
          </a>
        </div>
      )}
    </section>
  )
}
