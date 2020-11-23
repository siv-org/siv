export function generateTrackingNum() {
  const random = Math.random()
  const decimal = String(random).slice(2)
  const id = `${decimal.slice(0, 4)}-${decimal.slice(4, 8)}-${decimal.slice(8, 12)}`
  return id
}

// Formula to calculate chance of collision:
// Based on The Birthday Problem (https://www.dcode.fr/birthday-problem)

// You can run the following on:
// https://npm.runkit.com/bignumber.js

// var big = require('bignumber.js')

// var options = big('999999999999') // Twelve 9s
// var oneLess = options.minus(1)

// var one = big(1)

// var smallNumVoters = 500 // pilot

// var chance_of_collision = one.minus(oneLess.dividedBy(options).exponentiatedBy(smallNumVoters))
// console.log(chance_of_collision.toString()) // e-10, ~ one in ten billion

// var medNumVoters = 50000

// chance_of_collision = one.minus(oneLess.dividedBy(options).exponentiatedBy(medNumVoters)) // slow to calculate
// console.log(chance_of_collision.toString()) // e-8, ~ one in a 100 million
