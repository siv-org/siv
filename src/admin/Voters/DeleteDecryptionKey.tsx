import { api } from 'src/api-helper'

import { useUser } from '../auth'
import { useStored } from '../useStored'

export const DeleteDecryptionKey = () => {
  const { election_id, stop_accepting_votes } = useStored()
  const { user } = useUser()
  const { server_has_private_key } = useServerDecryptionKey()

  // Only show if Stop_Accepting_Votes is on.
  if (!stop_accepting_votes) return null

  // Only show for server admin, to take away their ability to selectively decrypt votes
  if (user.email !== 'david@siv.org') return null

  return (
    <button
      className={`relative bottom-px px-4 py-2 mb-1 ml-4 font-medium text-red-600 bg-white rounded-md border-2 border-red-500 border-solid transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
        server_has_private_key ? 'cursor-pointer hover:bg-red-50 hover:border-red-600' : 'cursor-not-allowed'
      }`}
      onClick={async () => {
        if (!server_has_private_key) return

        if (
          !confirm(
            'Are you sure? This will make it completely impossible to unlock new votes.\n\nThis CANNOT be undone.',
          )
        )
          return

        const response = await api(`election/${election_id}/admin/delete-server-decryption-key`)
        if (response.status === 201) {
          revalidate(election_id)
        } else {
          alert(JSON.stringify(await response.json()))
        }
      }}
    >
      {server_has_private_key ? "Delete Server's Decryption Key" : 'Server decryption key was deleted.'}
    </button>
  )
}

import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'

type ServerDecryptionKey = { server_has_private_key?: boolean }

const revalidate = (election_id?: string) => mutate(url(election_id))
function useServerDecryptionKey(): ServerDecryptionKey {
  const election_id = useRouter().query.election_id as string | undefined

  const { data }: { data?: ServerDecryptionKey } = useSWR(election_id ? url(election_id) : null, (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  )

  return { ...data }
}

const url = (election_id?: string) =>
  `${window.location.origin}/api/election/${election_id}/admin/get-server-decryption-key-status`
