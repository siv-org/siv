const comment = `Each keyshare holder has their own private key.

But their public keys can be calculated publicly by anyone, just via the Public Broadcasts Commitments.

e.g. for private "received_shares" rs_1, rs_2, rs_3 their private keyshare is the sum: ks = rs_1 + rs_2 + rs_3.

Anyone can calculate each g*rs_1, g*rs_2, g*rs_3 as Sum( c from 1 to t ){ Ac * (receivers_index ^c) }.

Thus anyone can calculate: g*ks = g * (rs_1 + rs_2 + rs_3) = g*rs_1 * g*rs_2 * g*rs_3`

const text = `function compute_g_to_keyshare(receivers_index_j: number, Broadcasts: RP[][]) {
  const g_to_rss = Broadcasts.map((Broadcast) => {
    const multiplicands = Broadcast.map((B, k) => B.multiply(receivers_index_j ** k))

    return sum_points(multiplicands)
  })

  return sum_points(g_to_rss)
}`

export const ComputeGToBroadcasts = () => {
  return (
    <details className="mt-5 w-full">
      <summary className="p-2 -ml-2 w-full rounded-lg cursor-pointer hover:bg-gray-100">
        <h3 className="text-xl">&nbsp;Pub Keys = G to Commitments</h3>
      </summary>

      <p>
        From{' '}
        <a
          className="text-blue-500 hover:underline"
          href="https://github.com/siv-org/siv/blob/95c2d57e8d12fec0602597b6f6c5897e2a7e7d60/src/crypto/threshold-keygen.ts#L105"
          rel="noreferrer noopener"
          target="_blank"
        >
          src/crypto/threshold-keygen.ts
        </a>
        :
      </p>
      <p className="p-2 mt-2 whitespace-pre-wrap bg-gray-100 rounded-md border-l-4">{comment}</p>
      <p className="p-2 mt-4 whitespace-pre-wrap rounded-lg bg-black/85 text-white/80">{text}</p>
    </details>
  )
}
