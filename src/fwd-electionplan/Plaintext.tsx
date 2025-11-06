import { useVoteContext } from './VoteContext'

export function Plaintext(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <>
      <div>
        {'{'}
        <br />
        {Object.keys(state.plaintext)
          .filter((k) => k !== 'verification')
          .map((key) => (
            <p key={key}>
              {key}:{' '}
              <span>
                &apos;{state.verification}:{state.plaintext[key]}&apos;
              </span>
              ,
            </p>
          ))}
        {'}'}
      </div>

      <style jsx>{`
        div {
          font-family: monospace;
          margin-top: 15;
          padding: 0 6%;
        }

        p {
          margin: 0 15px;
        }

        span {
          color: blue;
        }
      `}</style>
    </>
  )
}
