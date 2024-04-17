import { Election } from 'api/admin-all-elections'
import { useEffect, useState } from 'react'
import { api } from 'src/api-helper'
import TimeAgo from 'timeago-react'

import { useAllYourElections } from '../AllYourElections'
import { revalidate, useConventionInfo } from './useConventionInfo'

export const SetRedirection = () => {
  const { data } = useAllYourElections()
  const [filteredData, setFilteredData] = useState<Election[]>([])
  const [searchText, setSearchText] = useState('')
  const { active_redirect, id: convention_id } = useConventionInfo()

  const { elections } = (data as { elections: Election[] }) || {}

  useEffect(() => {
    if (!elections) return

    // Filter data based on search text
    const filtered = elections.filter((item) => item.election_title.toLowerCase().includes(searchText.toLowerCase()))
    setFilteredData(filtered)
  }, [searchText, elections])

  if (!elections) return <p>Loading elections...</p>

  return (
    <div>
      <h3>Redirect your convention QRs to which of your ballots?</h3>

      {/* Filter input */}
      <input
        className="w-full px-3 text-[15px] py-2 text-gray-700 border rounded shadow"
        placeholder="Filter ballot by title"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {!filteredData.length && <p className="italic opacity-70">No elections found</p>}

      {/* Filtered list */}
      <ol className="h-64 px-1.5 py-2 mb-4 overflow-y-scroll list-none rounded-lg shadow-inner bg-neutral-50">
        {filteredData.map(({ created_at, election_title, id }, i) => (
          <li
            className={`flex justify-between items-center py-1 px-1.5 rounded cursor-pointer hover:bg-gray-200 group ${
              active_redirect === id ? 'bg-blue-800/20 hover:!bg-blue-800/30' : ''
            }`}
            key={id}
            onClick={async () =>
              confirm(`${active_redirect !== id ? `Redirect QRs to '${election_title}'?` : 'Remove redirection?'}`) &&
              (await api(`/conventions/${convention_id}/set-redirect`, {
                election_id: active_redirect !== id ? id : '',
              })) &&
              revalidate(convention_id || '')
            }
          >
            <span>
              <span className="mr-0.5 opacity-50">{i + 1}. </span>
              <span className="relative">{election_title} </span>
              <span className="opacity-50">
                <TimeAgo datetime={new Date(created_at._seconds * 1000)} />
              </span>
            </span>

            {/* 'Set' hover hint */}
            <span className="text-xs opacity-0 group-hover:opacity-30">Set</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
