import { DemoStep, STEP_META } from './content'

export type DemoState = {
  auth: string
  buyerScreenshot: null | string
  choice: null | string
  coercedChoice: null | string
  completed: Set<string>
  device1Tampered: boolean
  digits: string
  future: DemoStep[]
  history: DemoStep[]
  honestChoice: null | string
  malwareConfirmed: boolean
  overridden: boolean
  search: string
  step: DemoStep
  strengthened: null | string
  unlocked: UnlockedVote[]
  verification: null | string
}

export type UnlockedVote = { choice: string; verification: string; yours?: boolean }

export function back(prev: DemoState): DemoState {
  if (!prev.history.length) return prev
  return {
    ...prev,
    future: [prev.step, ...prev.future],
    history: prev.history.slice(0, -1),
    step: prev.history[prev.history.length - 1],
  }
}

export function forward(prev: DemoState): DemoState {
  if (!prev.future.length) return prev
  const [step, ...future] = prev.future
  return { ...prev, future, history: [...prev.history, prev.step], step }
}

export function go(prev: DemoState, step: DemoStep): DemoState {
  return markComplete(visit(prev, step), STEP_META[step].unlocks)
}

export function initState(): DemoState {
  return {
    auth: '',
    buyerScreenshot: null,
    choice: null,
    coercedChoice: null,
    completed: new Set(),
    device1Tampered: false,
    digits: '',
    future: [],
    history: [],
    honestChoice: null,
    malwareConfirmed: false,
    overridden: false,
    search: '',
    step: 'intro',
    strengthened: null,
    unlocked: [],
    verification: null,
  }
}

export function markComplete(prev: DemoState, ids: string[] = []): DemoState {
  if (!ids.length) return prev
  const completed = new Set(prev.completed)
  ids.forEach((id) => completed.add(id))
  return { ...prev, completed }
}

export function pathIndex(step: DemoStep): number {
  if (step === 'intro') return -1
  if (step === 'invite') return 0
  if (step === 'vote') return 1
  // Submitted, but results aren't open yet — past vote, not yet on verify
  if (step === 'coercion' || step === 'malware' || step === 'strengthen' || step === 'submit') return 1.5
  if (step === 'done') return 3
  return 2
}

export function visit(prev: DemoState, step: DemoStep): DemoState {
  if (prev.step === step) return prev
  return { ...prev, future: [], history: [...prev.history, prev.step], step }
}
