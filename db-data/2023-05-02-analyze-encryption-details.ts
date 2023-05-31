import { RP, pointToString, stringToPoint } from '../src/crypto/curve'

const encodeds = ['']

// const reEncoded = []

const plaintexts = []

;(() => {
  console.log(
    encodeds
      .map((s) => s.trim())
      .filter((x) => x)
      .map(RP.fromHex)
      .map(pointToString),
  )

  console.log(plaintexts.map(stringToPoint).map((p) => p.toHex()))
})()
