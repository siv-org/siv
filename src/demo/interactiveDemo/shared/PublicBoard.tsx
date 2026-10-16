import { useState } from 'react'

import { ExpandableHex } from './ExpandableHex'

export function PublicBoard({
  votes,
}: {
  votes: { auth: string; encrypted: string; lock: string; name: string; yours: boolean }[]
}) {
  const [openHex, setOpenHex] = useState<null | string>(null)
  // Mirrors src/status/AcceptedVotes columns; demo-green highlight for yours
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-black/[0.07]">
      <table className="w-full min-w-[520px] border-collapse text-left text-[0.78rem]">
        <thead className="bg-black/[0.03] text-h26-muted">
          <tr>
            <th className="px-3 py-2 font-medium" rowSpan={2} />
            <th className="px-3 py-2 font-medium" rowSpan={2}>
              auth
            </th>
            <th className="px-3 py-2 text-center font-medium" colSpan={2}>
              mayor
            </th>
          </tr>
          <tr>
            <th className="px-3 py-1.5 font-medium">encrypted</th>
            <th className="px-3 py-1.5 font-medium">lock</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((v, i) => (
            <tr className={v.yours ? 'bg-h26-green/[0.1]' : ''} key={v.auth}>
              <td className="px-3 py-2 text-h26-muted">{i + 1}.</td>
              <td className="px-3 py-2 font-mono26">
                {v.auth}
                {v.yours ? <span className="ml-1.5 text-[0.68rem] font-medium text-h26-green">← you</span> : null}
              </td>
              {(['encrypted', 'lock'] as const).map((kind) => {
                const id = `${v.auth}:${kind}`
                return (
                  <td className="max-w-[180px] px-3 py-2 align-top" key={id}>
                    <ExpandableHex
                      expanded={openHex === id}
                      onToggle={() => setOpenHex(openHex === id ? null : id)}
                      value={v[kind]}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
