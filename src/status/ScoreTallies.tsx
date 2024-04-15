import { mapValues, mean, sortBy, sum } from 'lodash-es'
import { useState } from 'react'
import { Item } from 'src/vote/storeElectionInfo'

import { useDecryptedVotes } from './use-decrypted-votes'

export const ScoreTallies = ({ id, options }: { id: string; options: Item['options'] }) => {
  const [showSpread, setShowSpread] = useState(false)

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
  const sorted = sortBy(options, ({ name, value }) => averagesPerOption[value || name] ?? -Infinity).reverse()

  const deviations = mapValues(scoresPerOption, stdDev)

  return (
    <table>
      <thead>
        <tr className="opacity-50 text-[12px]">
          <th></th>
          <th className="px-4" onClick={() => setShowSpread(!showSpread)}>
            Average
          </th>
          <th># cast</th>
          {showSpread && <th className="pl-4">Deviation</th>}
        </tr>
      </thead>
      <tbody>
        {sorted.map(({ name, value }) => {
          const option = value || name

          return (
            <tr key={option}>
              <td>{name}</td>
              <td className="text-center">{formatNumber(averagesPerOption[option]) ?? ''}</td>
              <td className="opacity-50 text-[12px] text-center">{(scoresPerOption[option] || []).length}</td>
              {showSpread && (
                <td className="opacity-50 text-[12px] text-center pl-4">{formatNumber(deviations[option])}</td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/** Show at most `maxPrecision` decimal places */
const formatNumber = (num?: number, maxPrecision = 2) => {
  if (num === undefined) return
  if (num % 1 === 0) return num
  const currentPrecision = num.toString().split('.')[1].length
  const precision = Math.min(currentPrecision, maxPrecision)
  return num.toFixed(precision)
}

/** Calc standard deviation of a set of numbers */
const stdDev = (values: number[]) => {
  const avg = mean(values)
  const diffs = values.map((x) => Math.pow(x - avg, 2))

  return Math.sqrt(sum(diffs) / values.length)
}
// console.log(stdDev([-4, +5, -4, +4])) // 4.26
// console.log(stdDev([+2, -1, 0, 0])) // 1.09
