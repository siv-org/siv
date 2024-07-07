import { useStored } from '../useStored'

export const NumVotedRow = ({
  hide_approved,
  hide_voted,
  num_approved,
  num_voted,
  toggle_hide_approved,
  toggle_hide_voted,
}: {
  hide_approved: boolean
  hide_voted: boolean
  num_approved: number
  num_voted: number
  toggle_hide_approved: () => void
  toggle_hide_voted: () => void
}) => {
  const { esignature_requested, valid_voters } = useStored()

  if (!valid_voters) return null

  return (
    <div className="flex justify-between mt-3 mb-1.5 mr-4">
      <span>
        <i>
          {num_voted} of {valid_voters.length} voted (
          {valid_voters.length == 0 ? 0 : Math.round((num_voted / valid_voters.length) * 100)}%)
        </i>
        {/* Toggle hide voted */}
        <a className="cursor-pointer text-[12px] ml-2.5" onClick={toggle_hide_voted}>
          <>{hide_voted ? 'Show' : 'Hide'} Voted</>
        </a>
      </span>

      {esignature_requested && !!num_voted && (
        <span className="text-right">
          <i>
            {num_approved} of {num_voted} signatures approved ({Math.round((num_approved / num_voted) * 100)}
            %)
          </i>
          {/* Toggle hide approved */}
          <a className="cursor-pointer text-[12px] ml-2.5" onClick={toggle_hide_approved}>
            <>{hide_approved ? 'Show' : 'Hide'} Approved</>
          </a>
        </span>
      )}
    </div>
  )
}
