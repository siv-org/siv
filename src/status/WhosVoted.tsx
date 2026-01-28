import { useNumVotes } from './AcceptedVotes'
import { useElectionId } from './use-election-id'
import { useElectionInfo } from './use-election-info'

const missing = '(no name)'

export const WhosVoted = () => {
  const election_id = useElectionId()
  const { public_whos_voted_snapshot } = useElectionInfo()
  const { num_votes } = useNumVotes(election_id)
  if (!public_whos_voted_snapshot?.length) return null

  const rows = [...public_whos_voted_snapshot]
    .map((r) => ({ ...r, display_name: r.display_name?.trim() || '' }))
    .sort((a, b) => {
      const an = a.display_name ? a.display_name.toLowerCase() : '\uffff'
      const bn = b.display_name ? b.display_name.toLowerCase() : '\uffff'
      return an.localeCompare(bn)
    })

  const unpublished = num_votes - public_whos_voted_snapshot.filter(({ has_voted }) => has_voted).length

  return (
    <div className="bg-white p-4 rounded-lg shadow-[0_2px_2px_hsla(0,0%,50%,0.333),0_4px_4px_hsla(0,0%,50%,0.333),0_6px_6px_hsla(0,0%,50%,0.333)] mt-6">
      <h3 className="mt-0 mb-2">Who&apos;s Voted</h3>
      {unpublished > 0 && (
        <div className="mb-2 text-xs opacity-50">
          {unpublished} new voter{unpublished === 1 ? ' ' : 's'} not published yet.
        </div>
      )}
      <table className="block overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px] pb-2">
        <thead>
          <tr className="bg-[#f9f9f9] text-[11px]">
            <th>#</th>
            <th>display name</th>
            <th>voted</th>
          </tr>
        </thead>
        <tbody className="[&_td]:whitespace-nowrap bg-white">
          {rows.map(({ display_name, has_voted }, index) => (
            <tr key={`${display_name || missing}-${index}`}>
              <td>{index + 1}</td>
              <td>{display_name || missing}</td>
              <td className="font-bold text-center">{has_voted ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
