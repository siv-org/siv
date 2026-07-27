import { generateColumnNames } from 'src/vote/generateColumnNames'
import { Item } from 'src/vote/storeElectionInfo'

export const parseBallotDesign = (raw?: string): Item[] | undefined => {
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

/**
 * Strip any stray columns not in the current ballot design (e.g. stale selections left over from a
 * duplicated/edited ballot). Keeps public results consistent with the ballot and avoids leaking
 * orphaned data that could deanonymize a voter. Without a ballot design we can't know which columns
 * are valid, so we return the votes untouched rather than risk dropping real data.
 */
export const filterToBallotColumns = (decrypted: Record<string, string>[], ballot_design?: Item[]) => {
  if (!ballot_design) return decrypted
  const valid = new Set(['tracking', ...generateColumnNames({ ballot_design }).columns])
  return decrypted.map((vote) => Object.fromEntries(Object.entries(vote).filter(([key]) => valid.has(key))))
}
