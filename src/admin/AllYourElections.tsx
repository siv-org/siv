import { Election } from 'api/admin-all-elections'
import Link from 'next/link'
import { useReducer, useState } from 'react'
import { api } from 'src/api-helper'
import useSWR, { mutate } from 'swr'
import TimeAgo from 'timeago-react'

import { Spinner } from './Spinner'

export const fetcher = (url: string) =>
  fetch(url).then(async (resp) => {
    if (!resp.ok) throw await resp.json()
    return await resp.json()
  })

export const useAllYourElections = () => useSWR('/api/admin-all-elections', fetcher)

export const AllYourElections = () => {
  const [show, toggle] = useReducer((state) => !state, false)
  const [inArchiveMode, setInArchiveMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [isArchiving, setIsArchiving] = useState(false)

  // Load the aggregated count on first render
  const { election_count } = useSWR('/api/admin-elections-count', fetcher).data || {}

  // Only start fetching the full list after clicking "Show"
  const { data: { archived_count, elections } = {}, isLoading: listLoading } = useSWR(
    show ? '/api/admin-all-elections' : null,
    fetcher,
  )

  return (
    <>
      <h2>
        Your Ballots: <span className="font-normal">{election_count}</span>{' '}
        {!!election_count && (
          <a
            className="text-[14px] font-normal ml-1 cursor-pointer"
            onClick={() => {
              toggle()
              if (!show) {
                setInArchiveMode(false)
                setSelectedIds(new Set())
              }
            }}
          >
            [ {show ? '- Hide' : '+ Show'} ]
          </a>
        )}
      </h2>

      {show && (
        <ul className="pl-4">
          {/* Loading... message */}
          {listLoading && <div className="animate-pulse">Loading…</div>}

          {/* Each row */}
          {elections?.map(({ created_at, election_title, id }: Election) => (
            <li className="flex" key={id}>
              {/* Archive checkbox (Archive mode only) */}
              {inArchiveMode && (
                <input
                  aria-label={`Select ${election_title}`}
                  checked={selectedIds.has(id)}
                  className="mr-2 cursor-pointer"
                  onChange={function toggleSelected() {
                    setSelectedIds((prev) => {
                      const next = new Set(prev)
                      if (next.has(id)) next.delete(id)
                      else next.add(id)

                      return next
                    })
                  }}
                  type="checkbox"
                />
              )}

              {/* Link to Election */}
              <Link href={`/admin/${id}/voters`}>
                <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {election_title}
              </Link>
            </li>
          ))}

          {/* Archived count */}
          {!!archived_count && <p className="italic text-[14px] opacity-50 mt-2 mb-0">and {archived_count} archived</p>}

          {/* Archive controls */}
          {!listLoading && !!elections?.length && (
            <li className="mt-3 mb-2 list-none">
              {!inArchiveMode ? (
                // Start Archive mode
                <button
                  className="text-[14px] cursor-pointer border border-solid border-black/60 bg-white rounded-md p-2 text-neutral-600 hover:bg-black/5 active:bg-black/10"
                  onClick={() => setInArchiveMode(true)}
                  type="button"
                >
                  Archive some elections
                </button>
              ) : (
                <span className="flex">
                  {/* Cancel button */}
                  <button
                    className="text-[14px] cursor-pointer border border-solid border-black/60 bg-white rounded-md p-2 text-neutral-600 hover:bg-black/5 active:bg-black/10"
                    onClick={function exitPickMode() {
                      setInArchiveMode(false)
                      setSelectedIds(new Set())
                    }}
                    type="button"
                  >
                    Cancel
                  </button>

                  {selectedIds.size > 0 && (
                    // Archive button
                    <button
                      className="ml-2 p-2 rounded-md border border-solid cursor-pointer text-[14px] bg-blue-50 border-black/60 text-neutral-600 hover:bg-blue-100 active:bg-blue-200"
                      onClick={async function archiveSelected() {
                        const ids = [...selectedIds]
                        if (!ids.length) return
                        if (!confirm(`Archive ${ids.length} election${ids.length === 1 ? '' : 's'}?`)) return
                        setIsArchiving(true)
                        for (const id of ids) {
                          const resp = await api(`election/${id}/admin/archive-election`)
                          if (!resp.ok) {
                            const err = await resp.json().catch(() => ({}))
                            alert((err as { error?: string }).error || 'Archive failed')
                            await Promise.all([
                              mutate('/api/admin-all-elections'),
                              mutate('/api/admin-elections-count'),
                            ])
                            return
                          }
                        }
                        await Promise.all([mutate('/api/admin-all-elections'), mutate('/api/admin-elections-count')])
                        setInArchiveMode(false)
                        setSelectedIds(new Set())
                        setIsArchiving(false)
                      }}
                      type="button"
                    >
                      {isArchiving && <Spinner />} Archiv{!isArchiving ? 'e' : 'ing'} {selectedIds.size} selected
                    </button>
                  )}
                </span>
              )}
            </li>
          )}
          <br />
        </ul>
      )}
    </>
  )
}
