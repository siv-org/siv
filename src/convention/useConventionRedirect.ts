import { PublicConventionInfo } from 'api/conventions/[convention_id]/load-voter-redirect'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

/** Looks up redirect info for `convention_id` and `voter_id`, redirects if found. */
export const useConventionRedirect = () => {
  const { convention_id, voter_id } = useRouter().query
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [publicConventionInfo, setPublicConventionInfo] = useState<PublicConventionInfo>()

  useEffect(() => {
    setErrorMessage('')
    if (!convention_id || typeof convention_id !== 'string') return setErrorMessage('Missing convention_id')
    if (!voter_id || typeof voter_id !== 'string') return setErrorMessage('Missing voter_id')

    setLoading(true)
    api(`conventions/${convention_id}/load-voter-redirect?voter_id=${voter_id}`).then(async (res) => {
      const json = await res.json()
      setLoading(false)
      if (!res.ok) return setErrorMessage(json.error)
      if (json) return setPublicConventionInfo(json.info)
    })
  }, [convention_id, voter_id])

  return { convention_id, errorMessage, loading, publicConventionInfo, voter_id }
}
