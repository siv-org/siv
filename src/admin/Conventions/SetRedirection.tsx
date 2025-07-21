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

  // Filter list based on search text
  useEffect(() => {
    if (!elections) return

    const filtered = elections.filter((item) => item.election_title.toLowerCase().includes(searchText.toLowerCase()))
    setFilteredData(filtered)
  }, [searchText, elections])

  if (!elections) return <p>Loading elections...</p>

  return (
    <div>
      <h3>Redirect your convention QRs to which of your ballots?</h3>

      <table className="mt-1 h-64 px-1.5 py-2 mb-4 overflow-y-scroll rounded-lg shadow-inner bg-neutral-50">
        <thead>
          <tr>
            <th colSpan={7}>
              {/* Set filter textbox */}
              <input
                className="w-full px-3 text-[15px] py-2 text-gray-700 border rounded shadow"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Filter ballot by title"
                type="text"
                value={searchText}
              />

              {!filteredData.length && <p className="italic opacity-70">No elections found</p>}
            </th>
          </tr>

          {/* Table header */}
          <tr className="text-[12px] opacity-60 [&>*]:p-1 [&>*]:py-2">
            <th />
            <th className="text-left">Ballot name</th>
            <th>Created</th>
            <th>Voters</th>
            <th>Votes Cast</th>
            <th className="relative bottom-px">Finalized?</th>
            <th>Redirect</th>
          </tr>
        </thead>

        {/* Filtered list */}
        <tbody>
          {filteredData.map((e, i) => {
            const is_active_redirect = e.id === active_redirect
            return (
              // Each row
              <tr
                className={`text-center py-1 px-1.5 rounded hover:bg-gray-200 group [&>td]:px-1 ${
                  is_active_redirect ? 'bg-blue-800/20 hover:!bg-blue-800/30' : ''
                }`}
                key={e.id}
              >
                {/* # */}
                <td className="opacity-50 text-[11px]">{i + 1}</td>

                {/* Ballot name */}
                <td className="max-w-[300px] text-left">
                  <a
                    className="text-black/90 hover:text-blue-700"
                    href={`/admin/${e.id}/voters`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {e.election_title}
                  </a>
                </td>

                {/* Created */}
                <td className="opacity-50 text-[11px]">
                  <TimeAgo datetime={new Date(e.created_at._seconds * 1000)} />
                </td>

                {/* Voters */}
                <td className={!e.num_voters ? 'opacity-30' : ''}>{e.num_voters}</td>

                {/* Votes */}
                <td className={!e.num_votes ? 'opacity-30' : ''}>{e.num_votes}</td>

                {/* Finalized? */}
                <td className="!px-2">
                  <input checked={e.ballot_design_finalized && !!e.threshold_public_key} disabled type="checkbox" />

                  {/* Hints if active but not finalized */}
                  {is_active_redirect && (
                    <>
                      {/* Ballot not finalized */}
                      {!e.ballot_design_finalized ? (
                        <div>
                          <span className="text-[8px] relative bottom-0.5 opacity-70 hover:no-underline">❌ </span>
                          <a
                            className="text-black/60 hover:text-blue-700"
                            href={`/admin/${e.id}/ballot-design`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Ballot design not finalized
                          </a>
                        </div>
                      ) : (
                        ''
                      )}

                      {/* Privacy Protectors not set */}
                      {!e.threshold_public_key ? (
                        <div className="text-left">
                          <span className="text-[8px] relative bottom-0.5 opacity-70">❌ </span>
                          <a
                            className="text-black/60 hover:text-blue-700"
                            href={`/admin/${e.id}/privacy`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Privacy Protectors not set
                          </a>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </td>

                {/* Redirect: Set / Active */}
                <td
                  className={`text-xs cursor-pointer group-hover:opacity-60 ${
                    is_active_redirect ? '!opacity-60' : 'opacity-0'
                  } hover:!opacity-80 hover:bg-blue-800/30`}
                  onClick={async () =>
                    confirm(
                      `${!is_active_redirect ? `Redirect QRs to '${e.election_title}'?` : 'Remove redirection?'}`,
                    ) &&
                    (await api(`/conventions/${convention_id}/set-redirect`, {
                      election_id: !is_active_redirect ? e.id : '',
                    })) &&
                    revalidate(convention_id || '')
                  }
                >
                  {is_active_redirect ? (
                    'Active'
                  ) : (
                    <span className="px-3 bg-white rounded-lg border border-solid border-black/50">Set</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
