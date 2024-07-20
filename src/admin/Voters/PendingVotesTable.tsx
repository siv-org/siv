import { CheckOutlined } from '@ant-design/icons'
import { useReducer, useState } from 'react'
import { OnClickButton } from 'src/_shared/Button'
import { api } from 'src/api-helper'

import { useStored } from '../useStored'
import { CheckboxCell, CheckboxHeaderCell, hoverable } from './CheckboxCell'
import { mask } from './mask-token'
import { use_multi_select } from './use-multi-select'

export const PendingVotesTable = () => {
  const { election_id, pending_votes, voter_applications_allowed } = useStored()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const { last_selected, pressing_shift, set_last_selected } = use_multi_select()
  const [showAll, setShowAll] = useState(false)
  const [checked, set_checked] = useState<boolean[]>(new Array(pending_votes?.length).fill(false))

  if (!pending_votes || (!pending_votes.length && !voter_applications_allowed)) return null

  // Pagination logic
  const pageSize = 200
  const totalPages = Math.ceil(pending_votes.length / pageSize)
  const page = 1
  const onThisPage = pending_votes.slice((page - 1) * pageSize, page * pageSize)

  const num_checked = checked.filter((c) => c).length

  function ApproveVoteButton() {
    return (
      <OnClickButton
        className="!m-0 bg-white"
        disabled={!num_checked}
        style={{ padding: '5px 10px' }}
        onClick={async () => {
          const response = await api(`election/${election_id}/admin/approve-pending-vote`)
          if (!response.ok) alert((await response.json()).error)
        }}
      >
        <>
          <CheckOutlined className="relative mr-1 font-bold top-px" />
          Approve {num_checked} Vote{num_checked !== 1 && 's'}
        </>
      </OnClickButton>
    )
  }

  return (
    <div className="pt-3 pb-1 pl-4 mt-8 -ml-4 rounded shadow-md bg-orange-50">
      <ApproveVoteButton />
      <div className="mt-2 mb-1">
        Pending Votes <span className="opacity-50">(via shareable link)</span>
      </div>
      <table className="block w-full pb-3 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px]">
        <thead>
          <tr className="bg-[#f9f9f9] text-[11px]">
            <CheckboxHeaderCell {...{ checked, set_checked, set_last_selected }} />
            <th>#</th>
            <th>first name</th>
            <th>last name</th>
            <th>email</th>
            <th>email verified?</th>
            <th className={hoverable} onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
          </tr>
        </thead>
        <tbody className="[&_td]:whitespace-nowrap bg-white">
          {(showAll ? pending_votes : onThisPage).map(
            ({ email, first_name, is_email_verified, last_name, link_auth }, index) => (
              <tr className={`${checked[index] && 'bg-[#f1f1f1]'}`} key={email}>
                <CheckboxCell {...{ checked, index, last_selected, pressing_shift, set_checked, set_last_selected }} />
                <td>{index + 1}</td>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{email}</td>
                <td className="text-center">{is_email_verified ? '✓' : ''}</td>
                <td className="font-mono text-[12px]">{mask_tokens ? mask(link_auth) : link_auth}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      {totalPages > 1 && !showAll && (
        <div className="text-[13px] mt-2.5">
          Showing only first {pageSize} of {pending_votes.length}.{' '}
          <a className="cursor-pointer" onClick={() => setShowAll(true)}>
            (Show All)
          </a>
        </div>
      )}
    </div>
  )
}
