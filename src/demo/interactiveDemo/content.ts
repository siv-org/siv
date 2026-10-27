import { default_max_score, default_min_score, default_multiple_votes_allowed } from 'src/admin/BallotDesign/Wizard'
import { defaultRankingsAllowed } from 'src/vote/Ballot'
import { Item as BallotItem } from 'src/vote/storeElectionInfo'

const CANDIDATES = ['Sam Navarro', 'Alex Okafor', 'Jordan Park', 'Casey Dubois'] as const

export type BallotMethod = 'approval' | 'budget' | 'multi' | 'plurality' | 'ranked' | 'score'

export const BALLOT_METHODS: { id: BallotMethod; label: string }[] = [
  { id: 'plurality', label: 'Choose Only One' },
  { id: 'ranked', label: 'Ranked Choice' },
  { id: 'approval', label: 'Approval' },
  { id: 'multi', label: 'Choose up to X' },
  { id: 'score', label: 'Score' },
  { id: 'budget', label: 'Budget' },
]

// ponytail: Fixed IDs encode version and method; no duplicate metadata on election records.
export const sharedDemoElectionId = (method: BallotMethod) => `demo-shared-v${method === 'score' ? 5 : 4}-${method}`
export const sharedDemoMethod = (electionId: string) =>
  BALLOT_METHODS.find(({ id }) => sharedDemoElectionId(id) === electionId)?.id

const DEMO_BUDGET_AVAILABLE = 100_000

const DEMO_BALLOT_OPTIONS = CANDIDATES.map((name, index) => ({
  name,
  sub: ['Silver Party', 'Gold Party', 'Violet Party', 'Teal Party'][index],
}))

const DEMO_BUDGET_OPTIONS = ['Proposal A', 'Proposal B', 'Proposal C', 'Proposal D'].map((name) => ({ name }))

export function ballotDesignFor(method: BallotMethod): BallotItem {
  const base = {
    id: 'vote',
    options: DEMO_BALLOT_OPTIONS,
    randomize_order: method !== 'budget',
    title: 'Who should be the next Mayor?',
    write_in_allowed: false,
  }
  if (method === 'approval') return { ...base, type: 'approval' }
  if (method === 'multi')
    return { ...base, multiple_votes_allowed: default_multiple_votes_allowed, type: 'multiple-votes-allowed' }
  if (method === 'ranked') return { ...base, multiple_votes_allowed: defaultRankingsAllowed, type: 'ranked-choice-irv' }
  if (method === 'score') return { ...base, max_score: default_max_score, min_score: default_min_score, type: 'score' }
  if (method === 'budget')
    return {
      ...base,
      budget_available: DEMO_BUDGET_AVAILABLE,
      options: DEMO_BUDGET_OPTIONS,
      title: 'How much should each proposal get?',
      type: 'budget',
    }
  return { ...base, type: 'choose-only-one' }
}
