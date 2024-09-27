import { api } from 'src/api-helper'

import { revalidate, useStored } from '../useStored'
import { Tooltip } from '../Voters/Tooltip'

export const BallotDesignFinalizedBanner = () => {
  const { election_id, valid_voters } = useStored()
  const has_votes = !!valid_voters?.filter((v) => v.has_voted).length

  return (
    <div className="flex items-center justify-between p-2 mb-5 border-2 border-solid rounded-lg border-green-700/50 bg-green-100/50">
      <span>
        The ballot design has been <i className="font-semibold">finalized</i>.
      </span>

      {/* 'Revert' button */}
      {!has_votes && (
        <Tooltip tooltip="Only possible before votes cast">
          <div
            className="inline px-2 py-1 border border-solid rounded cursor-pointer text-cyan-700 bg-white/70 border-black/30 hover:bg-white hover:text-cyan-600"
            onClick={async () => {
              const response = await api(`election/${election_id}/admin/revert-finalized-ballot-design`)
              if (response.status !== 201) return alert(JSON.stringify(await response.json()))

              revalidate(election_id)
            }}
          >
            Revert
          </div>
        </Tooltip>
      )}
    </div>
  )
}
