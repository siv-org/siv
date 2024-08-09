import { mapValues } from 'lodash'

import { AsyncReturnType } from './async-return-type'
import { RP } from './curve'
import { shuffleWithProof, shuffleWithoutProof } from './shuffle'

export type CipherStrings = ReturnType<typeof stringifyShuffle>['shuffled'][0]
export function stringifyShuffle({ proof, shuffled }: AsyncReturnType<typeof shuffleWithProof>) {
  const p = proof
  const simple = p.simple_shuffle_proof
  return {
    proof: {
      As: p.As.map(String),
      Cs: p.Cs.map(String),
      Ds: p.Ds.map(String),
      Gamma: String(p.Gamma),
      H: String(p.H),
      Lambda1: String(p.Lambda1),
      Lambda2: String(p.Lambda2),
      Us: p.Us.map(String),
      Ws: p.Ws.map(String),
      sigmas: p.sigmas.map(String),
      simple_shuffle_proof: {
        Gamma: String(simple.Gamma),
        Thetas: simple.Thetas.map(String),
        Xs: simple.Xs.map(String),
        Ys: simple.Ys.map(String),
        alphas: simple.alphas.map(String),
      },
      tau: String(p.tau),
    },
    shuffled: shuffled.map((r) => mapValues(r, String)),
  }
}

export function stringifyShuffleWithoutProof({ shuffled }: AsyncReturnType<typeof shuffleWithoutProof>) {
  return { shuffled: shuffled.map((r) => mapValues(r, String)) }
}

export function destringifyShuffle({
  proof,
  shuffled,
}: ReturnType<typeof stringifyShuffle>): AsyncReturnType<typeof shuffleWithProof> {
  const p = proof
  const simple = p.simple_shuffle_proof
  return {
    proof: {
      As: p.As.map(RP.fromHex),
      Cs: p.Cs.map(RP.fromHex),
      Ds: p.Ds.map(RP.fromHex),
      Gamma: RP.fromHex(p.Gamma),
      H: RP.fromHex(p.H),
      Lambda1: RP.fromHex(p.Lambda1),
      Lambda2: RP.fromHex(p.Lambda2),
      Us: p.Us.map(RP.fromHex),
      Ws: p.Ws.map(RP.fromHex),
      sigmas: p.sigmas.map(BigInt),
      simple_shuffle_proof: {
        Gamma: RP.fromHex(simple.Gamma),
        Thetas: simple.Thetas.map(RP.fromHex),
        Xs: simple.Xs.map(RP.fromHex),
        Ys: simple.Ys.map(RP.fromHex),
        alphas: simple.alphas.map(BigInt),
      },
      tau: BigInt(p.tau),
    },
    shuffled: shuffled.map((r) => mapValues(r, RP.fromHex)),
  }
}

export function destringifyShuffleWithoutProof({
  shuffled,
}: ReturnType<typeof stringifyShuffleWithoutProof>): AsyncReturnType<typeof shuffleWithoutProof> {
  return { shuffled: shuffled.map((r) => mapValues(r, RP.fromHex)) }
}
