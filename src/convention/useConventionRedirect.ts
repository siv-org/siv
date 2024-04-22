import { ConventionRedirectInfo } from 'api/conventions/[convention_id]/load-qr-redirect'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'

/** Looks up redirect info for `convention_id` and `qr_id`, redirects if found. */
export const useConventionRedirect = () => {
  const { push, query } = useRouter()
  const { convention_id, qr_id } = query
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [conventionRedirectInfo, setConventionRedirectInfo] = useState<ConventionRedirectInfo>()

  useEffect(() => {
    setErrorMessage('')
    if (typeof convention_id !== 'string') return setErrorMessage('Missing convention_id')
    if (typeof qr_id !== 'string') return setErrorMessage('Missing qr_id')

    setLoading(true)
    api(`conventions/${convention_id}/load-qr-redirect?qr_id=${qr_id}`).then(async (res) => {
      const json = await res.json()
      setLoading(false)
      if (!res.ok) return setErrorMessage(json.error)
      if (json) setConventionRedirectInfo(json.info)
      const { active_ballot_auth, active_redirect } = json.info as ConventionRedirectInfo

      push(`/election/${active_redirect}/vote?auth=${active_ballot_auth}`)
    })
  }, [convention_id, qr_id])

  return { conventionRedirectInfo, convention_id, errorMessage, loading, qr_id }
}
