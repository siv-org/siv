// This file can generate more keyframes of random paths to paste into Paths.tsx
// (styled-jsx doesn't like keyframes generated on the fly)

export const quadrants = [
  [0, 0],
  [0, 50],
  [50, 0],
  [50, 50],
]
const positions = quadrants.map(([top, left]) => `left: ${left}%; top: ${top}%;`)
const randomPosition = () => positions[Math.floor(Math.random() * 4)]

const randomPath = (start: number, path: number) => `
@keyframes path-${start}-${path} {
  0% { ${positions[start]} }
  ${new Array(4)
    .fill(0)
    .map((_, index) => {
      const base = (index + 1) * 20
      return `
  ${base}%, ${base + 5}% { ${randomPosition()} }`
    })
    .join('')}

  100% { ${positions[start]} }
}`

export const makeMultiPaths = (amount: number) => {
  console.log(
    new Array(4)
      .fill(0)
      .map((_, start) =>
        new Array(amount)
          .fill(0)
          .map((_, path) => randomPath(start, path))
          .join('\n\n'),
      )
      .join('\n\n'),
  )
}
