import Image from 'next/image'
import esignatureIcon from 'public/esignature.png'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Switch } from '../BallotDesign/Switch'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const RequestEsignatures = () => {
  const [updating, setUpdating] = useState(false)
  const { election_id, esignature_requested } = useStored()

  async function toggleESignature() {
    setUpdating(true)
    const response = await api(`election/${election_id}/admin/set-esignature-requested`, {
      esignature_requested: !esignature_requested,
    })

    if (response.status === 201) {
      revalidate(election_id)
      setUpdating(false)
    } else {
      throw await response.json()
    }
  }

  return (
    <div>
      <label className="cursor-pointer" onClick={toggleESignature}>
        <span className="mr-1.5 relative top-0.5">
          <Image height={(218 / 700) * 70} layout="fixed" src={esignatureIcon} width={70} />
        </span>
        Request Drawn Signatures?
      </label>
      <span className="relative bottom-[3px] ml-3">
        <Switch checked={!!esignature_requested} label="" onClick={toggleESignature} />
      </span>
      {updating && <Spinner />}
    </div>
  )
}
