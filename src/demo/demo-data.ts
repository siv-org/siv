/** Poster properties from https://blog.siv.org/2025/11/siv-in-one-poster */
export type PosterProperty = {
  id: string
  label: string
  short: string
}

export const POSTER_PROPERTIES: PosterProperty[] = [
  {
    id: 'malware',
    label: 'Malware on voter devices',
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
  | 'encrypt'
  | 'intro'
  | 'invite'
  | 'malware'
  | 'strengthen'
  | 'submit'
  | 'unlock'
  | 'verify'
  | 'vote'

export const HAPPY_PATH: DemoStep[] = ['intro', 'invite', 'vote', 'encrypt', 'submit', 'unlock', 'verify', 'done']

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
  encrypt: {
    blurb: 'Your device seals the vote and generates a secret Verification # before anything leaves.',
    title: 'Encrypt on-device',
    unlocks: ['privacy'],
  },
  intro: {
    blurb: 'A sandbox election you can play as a voter — then optionally attack.',
    title: 'SIV, hands-on',
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
    blurb: 'The public board gets your ciphertext + auth — not your choices.',
    title: 'Submit encrypted vote',
    unlocks: ['open'],
  },
  unlock: {
    blurb: 'Election closes. Privacy Protectors shuffle, then jointly unlock. Fast-forward for the demo.',
    title: 'Shuffle & unlock',
    unlocks: ['privacy', 'ground-truth'],
  },
  verify: {
    blurb: 'Search the unlocked list for your Verification #. Computers aren’t the ground truth — you are.',
    title: 'Find your vote',
    unlocks: ['ground-truth', 'open'],
  },
  vote: {
    blurb: 'Mark your ballot. Same point-and-click UX as a real SIV election.',
    title: 'Mark your ballot',
  },
}
