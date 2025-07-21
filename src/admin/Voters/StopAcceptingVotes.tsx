import { CloseSquareOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Switch } from '../BallotDesign/Switch'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'
import { DeleteDecryptionKey } from './DeleteDecryptionKey'

export const StopAcceptingVotes = () => {
  const [updating, setUpdating] = useState(false)
  const { election_id, stop_accepting_votes } = useStored()

  async function toggle() {
    setUpdating(true)
    const response = await api(`election/${election_id}/admin/set-stop-accepting-votes`, {
      stop_accepting_votes: !stop_accepting_votes,
    })

    if (response.status === 201) {
      revalidate(election_id)
      setUpdating(false)
    } else {
      throw await response.json()
    }
  }

  return (
    <>
      <section className="mt-1 pt-0 p-1 ml-[-5px] cursor-pointer inline-block pr-3" onClick={toggle}>
        <label>
          <CloseSquareOutlined className="text-[20px] mr-1.5 relative top-0.5" />
          Stop accepting new votes?
        </label>
        <span className="relative bottom-[3px] ml-2">
          <Switch checked={!!stop_accepting_votes} label="" onClick={() => {}} />
        </span>
        {updating && <Spinner />}
      </section>
      <DeleteDecryptionKey />
    </>
  )
}
