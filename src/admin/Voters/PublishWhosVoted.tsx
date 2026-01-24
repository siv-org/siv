import { UsergroupAddOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const PublishWhosVoted = () => {
  const { election_id, public_whos_voted_snapshot, voters } = useStored()
  const [publishing, setPublishing] = useState(false)

  const hasAnyDisplayName = !!voters?.some(({ display_name }) => !!display_name?.trim())
  if (!hasAnyDisplayName) return null

  const publishedVotes = public_whos_voted_snapshot?.filter(({ has_voted }) => has_voted).length

  return (
    <section className="block mt-2 pt-0 p-1 ml-[-5px] pr-3">
      <button
        className="flex items-center px-3 py-2 bg-white rounded border-2 border-solid shadow-sm cursor-pointer border-black/15 hover:bg-neutral-50"
        onClick={async () => {
          if (!confirm('Publish the latest Who’s Voted list?')) return
          setPublishing(true)
          const response = await api(`election/${election_id}/admin/publish-whos-voted`, {})
          setPublishing(false)
          if (response.status !== 201) throw await response.json()
          revalidate(election_id)
          alert('Published.')
        }}
        type="button"
      >
        <UsergroupAddOutlined className="text-[18px] mr-1.5 relative top-px" />
        Publish latest Who&apos;s Voted list
        {publishing && (
          <span className="ml-2">
            <Spinner />
          </span>
        )}
      </button>

      {typeof publishedVotes === 'number' && (
        <div className="text-[12px] opacity-70 mt-1 ml-1">
          <a href={`/election/${election_id}`} rel="noreferrer" target="_blank">
            Published
          </a>{' '}
          {publishedVotes} {publishedVotes === 1 ? 'vote' : 'votes'}
        </div>
      )}
    </section>
  )
}

