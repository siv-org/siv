import type { AdminAllElectionsResponse, Election } from 'api/admin-all-elections'

import Link from 'next/link'
import { useReducer, useRef, useState } from 'react'
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
  const [draftActiveIds, setDraftActiveIds] = useState<Set<string>>(() => new Set())
  const [isSaving, setIsSaving] = useState(false)
  const prevActiveIdsRef = useRef<Set<string>>(new Set())

  // Load the aggregated count on first render
  const { election_count = 0 } = useSWR('/api/admin-elections-count', fetcher).data || {}

  // Only start fetching the full list after clicking "Show"
  const { data: listData, isLoading: listLoading } = useSWR<AdminAllElectionsResponse>(
    show ? '/api/admin-all-elections' : null,
    fetcher,
  )
  const elections = listData?.elections
  const total_count = elections?.length ?? 0

  const active_elections = elections?.filter((e: Election) => !e.archived_at) ?? []
  const archived_count = total_count - active_elections.length

  return (
    <>
      <h2>
        Your Ballots: <span className="font-normal">{election_count}</span>{' '}
        {election_count + archived_count > 0 && (
          <a
            className="text-[14px] font-normal ml-1 cursor-pointer"
            onClick={() => {
              toggle()
              if (!show) {
                setInArchiveMode(false)
                setDraftActiveIds(new Set())
              }
            }}
          >
            [ {show ? '- Hide' : '+ Show'} ]
          </a>
        )}
      </h2>

      {show && (
        <ul className="pl-1">
          {/* Loading... message */}
          {listLoading && <div className="animate-pulse">Loading…</div>}

          {!inArchiveMode
            ? // Normal list, not in archive mode
              active_elections.map(({ created_at, election_title, id }: Election) => (
                <li className="ml-5 h-5" key={id}>
                  <Link href={`/admin/${id}/voters`}>
                    <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {election_title}
                  </Link>
                </li>
              ))
            : // Archive mode list — active + archived, & checkboxes to toggle
              elections?.map(({ archived_at, created_at, election_title, id }: Election) => (
                <li className={`flex items-baseline h-5 ${archived_at ? 'opacity-60' : ''}`} key={id}>
                  {/* Checkbox: Shown/hidden */}
                  <input
                    checked={draftActiveIds.has(id)}
                    className="mr-2 cursor-pointer shrink-0"
                    onChange={function toggleDraftActive() {
                      setDraftActiveIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(id)) next.delete(id)
                        else next.add(id)

                        return next
                      })
                    }}
                    type="checkbox"
                  />
                  {/* Link to Election */}
                  <Link href={`/admin/${id}/voters`}>
                    <TimeAgo datetime={new Date(created_at._seconds * 1000)} />: {election_title}
                    {archived_at ? <span className="text-[12px] ml-1 opacity-70">(archived)</span> : null}
                  </Link>
                </li>
              ))}

          {/* Archive controls */}
          {!listLoading && !!elections?.length && (
            <li className="mt-3 mb-2 list-none">
              {!inArchiveMode ? (
                // Start Archive mode
                <button
                  className="text-[14px] cursor-pointer border border-solid border-black/30 bg-white rounded-md p-2 text-neutral-600 hover:bg-black/5 active:bg-black/10"
                  onClick={() => {
                    if (!elections?.length) return
                    const prev = new Set<string>(
                      elections.filter((e: Election) => !e.archived_at).map((e: Election) => e.id),
                    )
                    prevActiveIdsRef.current = prev
                    setDraftActiveIds(new Set(prev))
                    setInArchiveMode(true)
                  }}
                  type="button"
                >
                  {archived_count} election{archived_count === 1 ? '' : 's'} archived
                </button>
              ) : (
                // Save button
                <button
                  className="p-2 bg-blue-50 rounded-md border border-solid cursor-pointer text-[14px] border-blue-500 hover:bg-blue-100 active:bg-blue-200"
                  onClick={async function saveArchiveChanges() {
                    if (!elections?.length) return
                    const prev = prevActiveIdsRef.current
                    const draft = draftActiveIds
                    const toArchive = [...prev].filter((i) => !draft.has(i))
                    const toUnarchive = [...draft].filter((i) => !prev.has(i))
                    if (!toArchive.length && !toUnarchive.length) {
                      setInArchiveMode(false)
                      setDraftActiveIds(new Set())
                      return
                    }

                    setIsSaving(true)
                    for (const i of toArchive) {
                      const resp = await api(`election/${i}/admin/archive-election`)
                      if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}))
                        alert((err as { error?: string }).error || 'Archive failed')
                        await Promise.all([mutate('/api/admin-all-elections'), mutate('/api/admin-elections-count')])
                        setIsSaving(false)
                        return
                      }
                    }
                    for (const i of toUnarchive) {
                      const resp = await api(`election/${i}/admin/archive-election`, { unarchive: true })
                      if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}))
                        alert((err as { error?: string }).error || 'Restore failed')
                        await Promise.all([mutate('/api/admin-all-elections'), mutate('/api/admin-elections-count')])
                        setIsSaving(false)
                        return
                      }
                    }
                    await Promise.all([mutate('/api/admin-all-elections'), mutate('/api/admin-elections-count')])
                    setInArchiveMode(false)
                    setDraftActiveIds(new Set())
                    setIsSaving(false)
                  }}
                  type="button"
                >
                  {isSaving && <Spinner />} &nbsp;Sav{!isSaving ? 'e' : 'ing'}: {draftActiveIds.size} active,{' '}
                  {total_count - draftActiveIds.size} archived
                </button>
              )}
            </li>
          )}
          <br />
        </ul>
      )}
    </>
  )
}
