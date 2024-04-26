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
      <table className="mt-1 h-64 px-1.5 py-2 mb-4 overflow-y-scroll rounded-lg shadow-inner bg-neutral-50">
        <thead>
          <tr className="text-[12px] opacity-70 [&>*]:px-1">
            <th></th>
            <th className="text-left">Ballot name</th>
            <th>Created</th>
            <th>Voters</th>
            <th>Linked QRs</th>
            <th>Votes Cast</th>
            <th>Manage</th>
            <th>Finalized?</th>
            <th>Redirect</th>
          </tr>
        </thead>
        {filteredData.map(({ created_at, election_title, id }, i) => (
          <tr
            className={`text-center py-1 px-1.5 rounded hover:bg-gray-200 group ${
              active_redirect === id ? 'bg-blue-800/20 hover:!bg-blue-800/30' : ''
            }`}
            key={id}
          >
            <td className="opacity-50 text-[11px]">{i + 1}</td>
            <td className="max-w-[300px] text-left">{election_title} </td>
            <td className="opacity-50">
              <TimeAgo datetime={new Date(created_at._seconds * 1000)} />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td className="cursor-pointer">
              <a href={`/admin/${id}/voters`} rel="noreferrer" target="_blank">
                🔗
              </a>
            </td>
            <td>
              <input checked={false} type="checkbox" />
            </td>

            {/* 'Set' hover hint */}
            <td
              className={`text-xs cursor-pointer group-hover:opacity-30 ${
                active_redirect === id ? 'opacity-60' : 'opacity-0'
              } hover:!opacity-80 hover:bg-blue-800/30`}
              onClick={async () =>
                confirm(`${active_redirect !== id ? `Redirect QRs to '${election_title}'?` : 'Remove redirection?'}`) &&
                (await api(`/conventions/${convention_id}/set-redirect`, {
                  election_id: active_redirect !== id ? id : '',
                })) &&
                revalidate(convention_id || '')
              }
            >
              {active_redirect === id ? 'Active' : 'Set'}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}
