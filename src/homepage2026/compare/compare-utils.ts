import type { Score } from './compare-data'

export const getScore = (s: number | Score): number => (typeof s === 'number' ? s : s[0])

export const interpolateColor = (score: number): string => {
  const clamped = Math.max(0, Math.min(score, 10))

  const startColor = { b: 94, g: 63, r: 244 }
  const middleColor = { b: 212, g: 242, r: 252 }
  const endColor = { b: 74, g: 163, r: 22 }

  let r: number
  let g: number
  let b: number

  if (clamped <= 5) {
    const ratio = clamped / 5
    r = Math.round(startColor.r * (1 - ratio) + middleColor.r * ratio)
    g = Math.round(startColor.g * (1 - ratio) + middleColor.g * ratio)
    b = Math.round(startColor.b * (1 - ratio) + middleColor.b * ratio)
  } else {
    const ratio = (clamped - 5) / 5
    r = Math.round(middleColor.r * (1 - ratio) + endColor.r * ratio)
    g = Math.round(middleColor.g * (1 - ratio) + endColor.g * ratio)
    b = Math.round(middleColor.b * (1 - ratio) + endColor.b * ratio)
  }

  return `rgb(${r}, ${g}, ${b})`
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}
