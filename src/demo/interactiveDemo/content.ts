import { default_max_score, default_min_score, default_multiple_votes_allowed } from 'src/admin/BallotDesign/Wizard'
import { defaultRankingsAllowed } from 'src/vote/Ballot'
import { Item as BallotItem } from 'src/vote/storeElectionInfo'

import { joinChoices } from './shared/formatChoice'

/** Poster properties from https://blog.siv.org/2025/11/siv-in-one-poster */
export type PosterProperty = {
  id: string
  label: string
  short: string
}

export const POSTER_PROPERTIES: PosterProperty[] = [
  {
    id: 'malware',
    label: "Malware can't secretly change votes",
    short: 'Second-device check + updateable verification #',
  },
  {
    id: 'privacy',
    label: 'Strong privacy',
    short: 'Encrypted votes; mixnet breaks identity↔content link',
  },
  {
    id: 'stuffing',
    label: 'Duplicate voting & ballot stuffing',
    short: 'One auth token → one accepted ciphertext',
  },
  {
    id: 'coercion',
    label: 'Coercion & vote selling',
    short: 'Verifiable Private Overrides',
  },
  {
    id: 'ground-truth',
    label: 'Reliance on computers as ground truth',
    short: 'Find your verification # in the unlocked tally',
  },
  {
    id: 'open',
    label: 'Closed systems requiring blind trust',
    short: 'Public board + anyone can re-tally',
  },
]

export const CANDIDATES = ['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim'] as const

export type DemoStep =
  | 'audit'
  | 'coercion'
  | 'done'
  | 'intro'
  | 'invite'
  | 'malware'
  | 'strengthen'
  | 'submit'
  | 'unlock'
  | 'verify'
  | 'vote'

export const HAPPY_PATH: DemoStep[] = ['intro', 'invite', 'vote', 'submit', 'unlock', 'verify', 'done']

export const STEP_META: Record<DemoStep, { blurb: string; title: string; unlocks?: PosterProperty['id'][] }> = {
  audit: {
    blurb: 'Every ciphertext traces to a registered token. Anyone can re-tally the unlocked votes.',
    title: 'Auditor view',
    unlocks: ['stuffing', 'open'],
  },
  coercion: {
    blurb: 'Appear to comply with a buyer, then privately override at a polling station.',
    title: 'Anti-coercion: private override',
  },
  done: {
    blurb: 'You’ve walked the happy path and the hardcore defenses.',
    title: 'That’s SIV',
  },
  intro: {
    blurb: 'Experience SIV from multiple perspectives: voter, attacker, auditor, & admin',
    title: 'How to run a provably free & fair digital election',
  },
  invite: {
    blurb: 'Your election admin sent a one-time Auth Token. Only registered voters get one.',
    title: 'Invitation',
    unlocks: ['stuffing'],
  },
  malware: {
    blurb: 'A second device independently decrypts what was sealed. Malware on Device 1 can’t fake Device 2.',
    title: 'Anti-malware: double-device check',
  },
  strengthen: {
    blurb: 'Update the last digits of your Verification # after casting — stale screenshots stop matching.',
    title: 'Update your Verification #',
  },
  submit: {
    blurb: 'Your device keeps the Verification # and a sealed receipt of what left.',
    title: 'Confirmation vote was submitted',
    unlocks: ['open', 'privacy'],
  },
  unlock: {
    blurb: 'Election closes. Privacy Protectors shuffle, then jointly unlock. Fast-forward for the demo.',
    title: 'Shuffle & unlock',
    unlocks: ['privacy', 'ground-truth'],
  },
  verify: {
    blurb: 'Results are published. This is the appeal period: check the tally, your own vote, and the roll.',
    title: 'Results',
    unlocks: ['ground-truth', 'open', 'stuffing'],
  },
  vote: {
    blurb: '',
    title: 'Mark your ballot',
  },
}

export type BallotMethod = 'approval' | 'budget' | 'multi' | 'plurality' | 'ranked' | 'score'

export const BALLOT_METHODS: { id: BallotMethod; label: string }[] = [
  { id: 'plurality', label: 'Plurality' },
  { id: 'ranked', label: 'Ranked Choice' },
  { id: 'approval', label: 'Approval' },
  { id: 'multi', label: 'Choose up to X' },
  { id: 'score', label: 'Score' },
  { id: 'budget', label: 'Budget' },
]

export const DEMO_BUDGET_AVAILABLE = 100_000

export const DEMO_BALLOT_OPTIONS = CANDIDATES.map((name) => ({ name }))

export const DEMO_BUDGET_OPTIONS = ['Proposal A', 'Proposal B', 'Proposal C', 'Proposal D'].map((name) => ({ name }))

export const OTHER_VOTERS = [
  { auth: 'a1b2c3d4', name: 'Barton, Adam' },
  { auth: 'e5f6g7h8', name: 'Green, Elissa' },
  { auth: 'i9j0k1l2', name: 'Hauck, Erik' },
  { auth: 'm3n4o5p6', name: 'Schuster, Brad' },
  { auth: 'q7r8s9t0', name: 'Chen, Maya' },
  { auth: 'u1v2w3x4', name: 'Diaz, Luis' },
  { auth: 'y5z6a7b8', name: 'Nguyen, Kim' },
  { auth: 'c9d0e1f2', name: 'Patel, Riya' },
  { auth: 'g3h4i5j6', name: 'Okafor, Tunde' },
  { auth: 'k7l8m9n0', name: 'Rossi, Elena' },
]

export function ballotDesignFor(method: BallotMethod): BallotItem {
  const base = {
    id: 'vote',
    options: DEMO_BALLOT_OPTIONS,
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

export function choiceFromPlaintext(method: BallotMethod, plaintext: Record<string, string>) {
  const filled = Object.entries(plaintext).filter(([, v]) => v && v !== 'BLANK')
  if (!filled.length) return null
  if (method === 'plurality') return plaintext.vote || null
  if (method === 'approval' || method === 'multi') return joinChoices(filled.map(([, v]) => v).sort())
  if (method === 'ranked')
    return filled
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([, v], i) => `${i + 1}. ${v}`)
      .join(', ')
  return filled.map(([k, v]) => `${k.replace(/^vote_/, '')}: ${v}`).join(', ')
}
