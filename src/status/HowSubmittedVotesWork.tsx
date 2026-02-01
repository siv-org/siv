export const HowSubmittedVotesWork = () => {
  return (
    <Details summary="How these work" topLevel>
      <div className="my-1.5">Each row is a vote submission, encrypted:</div>

      <Details summary={<>The <Code color="pink">auth</Code> column identifies each voter</>}>
        Like the name & unique signature on the outside of a vote-by-mail envelope.

        <Details summary="Security Properties">
          <div>&middot; Infeasible to guess: 1 in a trillion odds</div>
          <div className="mt-1.5">&middot; Assigned by Election Administrator</div>
          <div className="mt-1.5">&middot; Auditable, even after voting</div>
          <div className="mt-1.5">&middot; Replaceable when necessary, eg if lost or stolen</div>
        </Details>
      </Details>

      <Details summary={<>
        Each pair <Code color="purple">encrypted</Code>/<Code color="purple">lock</Code> contains one vote selection.
      </>}>

        <Details summary="Elliptic Curve ElGamal encryption">
          <div>Encrypted = Message + (election_public_key * randomizer)</div>
          <div>Lock = G * randomizer</div>
          <a className="block my-1" href="https://en.wikipedia.org/wiki/ElGamal_encryption" rel="noreferrer" target="_blank">Wikipedia</a>

          <Details summary="Ristretto255 Prime Order Group of Curve25519">
            256-bit elliptic curve
            <div>Same curve widely used by iOS, Signal Messenger, Tor</div>
            <a className="block my-1" href="https://en.wikipedia.org/wiki/Curve25519" rel="noreferrer" target="_blank">Wikipedia</a>
          </Details>
        </Details>

        <Details summary="Re-encryption">
          <div>This algorithm supports {'"'}re-encryption{'"'}, enabling secure cryptographic shuffling for strong privacy.</div>
        </Details>



      </Details>

      <Details summary="Learn more">
        Visit <a href="/protocol" target="_blank">siv.org/protocol</a> for an illustrated guide, or <a href="https://docs.siv.org/technical-specifications" rel="noreferrer" target="_blank">docs.siv.org/technical-specifications</a> for more details.
      </Details>

    </Details>
  )
}


function Code({ children, color }: { children: React.ReactNode, color: 'pink' | 'purple'; }) {

  const bgColors = {
    pink: 'bg-pink-200/80',
    purple: 'bg-purple-200/80',
  }
  const bgColor = bgColors[color]

  return (
    <code className={`py-0.5 px-1 font-mono text-black rounded-md ${bgColor}`}>
      {children}
    </code>
  )
}

function Details({ children, summary, topLevel }: { children: React.ReactNode, summary: React.ReactNode; topLevel?: boolean; }) {
  const ifTopLevelDetails = topLevel ? "border border-gray-300 border-solid open:pb-2 [&>summary::marker]:text-black/20" : "[&>summary::marker]:text-black/40"
  const unindentSummaries = !topLevel ? '-ml-2' : ''

  return (
    <details className={`rounded-lg open:bg-gray-50 [&>summary::marker]:text-[11px] ${ifTopLevelDetails}`}>
      <summary className={`p-2 rounded-lg cursor-pointer hover:bg-gray-400/10 ${unindentSummaries}`}>
        &nbsp;{summary}
      </summary>

      <div className="pl-5">
        {children}
      </div>
    </details>
  )
}
