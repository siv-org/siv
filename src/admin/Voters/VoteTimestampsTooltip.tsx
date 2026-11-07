import { Fragment, ReactNode } from 'react'

const fmt = (iso: string) => new Date(iso).toLocaleString()

export type VoteTimestamps = {
  added_at?: string
  auth_added_at?: string
  created_at?: string
  verified_email_at?: string
}

export const voteTimestampsTooltip = ({
  added_at,
  auth_added_at,
  created_at,
  verified_email_at,
}: VoteTimestamps): ReactNode => {
  const rows = [
    ['Voted', created_at],
    ['Auth info', auth_added_at],
    ['Email verified', verified_email_at],
    ['Added', added_at],
  ]
    .filter((row): row is [string, string] => !!row[1])
    .sort(([, a], [, b]) => +new Date(a) - +new Date(b))

  if (!rows.length) return null

  return (
    <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 items-baseline whitespace-nowrap">
      {rows.map(([label, iso]) => (
        <Fragment key={label}>
          <span className="text-[11px] font-semibold opacity-70">{label}</span>
          <span className="text-[13px]">{fmt(iso)}</span>
        </Fragment>
      ))}
    </div>
  )
}
