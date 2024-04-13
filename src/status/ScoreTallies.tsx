import { mapValues, mean, sortBy } from 'lodash-es'
import { Item } from 'src/vote/storeElectionInfo'

import { useDecryptedVotes } from './use-decrypted-votes'

export const ScoreTallies = ({ id, options }: { id: string; options: Item['options'] }) => {
  const votes = useDecryptedVotes()

  const scoresPerOption: Record<string, number[]> = {}
  votes.forEach((vote) => {
    Object.entries(vote).forEach(([column, score]) => {
      if (column.startsWith(id)) {
        const option = column.slice(id.length + 1)
        if (!scoresPerOption[option]) scoresPerOption[option] = []
        scoresPerOption[option].push(+score)
      }
    })
  })

  const averagesPerOption = mapValues(scoresPerOption, mean)
  const sorted = sortBy(options, ({ name, value }) => averagesPerOption[value || name] || -Infinity).reverse()

  return (
    <table>
      <thead>
        <tr className="opacity-50 text-[12px]">
          <th></th>
          <th className="px-4">Average</th>
          <th># cast</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(({ name, value }) => {
          const option = value || name

          return (
            <tr key={option}>
              <td>{name}</td>
              <td className="text-center">{averagesPerOption[option] || ''}</td>
              <td className="opacity-50 text-[12px] text-center">{(scoresPerOption[option] || []).length}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
