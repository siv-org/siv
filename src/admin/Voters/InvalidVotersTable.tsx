import Image from 'next/image'
import { useReducer, useState } from 'react'

import { useStored } from '../useStored'
import { CheckboxCell, CheckboxHeaderCell, hoverable } from './CheckboxCell'
import InvalidatedVoteIcon from './invalidated.png'
import { mask } from './mask-token'
import { Signature, getStatus } from './Signature'
import { use_multi_select } from './use-multi-select'

export const InvalidVotersTable = ({ hide_approved, hide_voted }: { hide_approved: boolean; hide_voted: boolean }) => {
  const { election_id, esignature_requested, voters } = useStored()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const { last_selected, pressing_shift, set_last_selected } = use_multi_select()
  const [checked, set_checked] = useState<boolean[]>(new Array(voters?.length).fill(false))

  if (!voters) return null

  const shown_voters = voters.filter(
    ({ esignature_review, has_voted, invalidated }) =>
      invalidated && (!has_voted || !hide_voted) && (getStatus(esignature_review) !== 'approve' || !hide_approved),
  )

  if (!shown_voters || !shown_voters.length) return null

  return (
    <>
      <p className="mt-12 mb-1">Invalidated Voters</p>
      <table className="block w-full pb-3 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px]">
        <thead>
          <tr className="bg-[#f9f9f9] text-[11px]">
            <CheckboxHeaderCell {...{ checked, set_checked, set_last_selected }} />
            <th>#</th>
            <th>email</th>
            <th className={hoverable} onClick={toggle_tokens}>
              {mask_tokens ? 'masked' : 'full'}
              <br />
              auth token
            </th>
            <th>voted</th>
            {esignature_requested && <th>signature</th>}
          </tr>
        </thead>
        <tbody>
          {shown_voters.map(({ auth_token, email, esignature, esignature_review, has_voted }, index) => (
            <tr className={`${checked[index] && 'bg-[#f1f1f1]'}`} key={email}>
              <CheckboxCell {...{ checked, index, last_selected, pressing_shift, set_checked, set_last_selected }} />

              <td className={struckthrough}>{index + 1}</td>
              <td className={struckthrough}>{email}</td>
              <td className={`${struckthrough} font-mono text-[12px]`}>
                {mask_tokens ? mask(auth_token) : auth_token}
              </td>

              <td className="p-0 text-center">
                {has_voted ? (
                  <Image className="object-contain scale-25" height={23} src={InvalidatedVoteIcon} width={23} />
                ) : null}
              </td>

              {esignature_requested &&
                (has_voted ? <Signature {...{ election_id, email, esignature, esignature_review }} /> : <td />)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const struckthrough =
  "text-[#aaa] relative before:content-[''] before:absolute before:inset-x-0 before:top-1/2 before:border-b before:border-0 before:border-[#aaa] before:border-solid"
