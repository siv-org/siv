import { Switch } from '@material-ui/core'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const RequestEsignatures = () => {
  const [updating, setUpdating] = useState(false)
  const { election_id, esignature_requested } = useStored()
  return (
    <>
      <label>Request eSignatures?</label>
      <Switch
        checked={esignature_requested}
        color="primary"
        onClick={async () => {
          setUpdating(true)
          const response = await api(`election/${election_id}/admin/set-esignature-requested`, {
            esignature_requested: !esignature_requested,
            password: localStorage.password,
          })

          if (response.status === 201) {
            revalidate(election_id)
            setUpdating(false)
          } else {
            throw await response.json()
          }
        }}
      />
      {updating && <Spinner />}
    </>
  )
}
