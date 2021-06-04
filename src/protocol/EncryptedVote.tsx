import { omit } from 'lodash-es'

import { useVoteContext } from './VoteContext'

export function EncryptedVote(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <>
      <div>
        {'{'}
        {Object.keys(omit(state.encrypted, 'auth')).map((key) => (
          <pre key={key}>
            {key}: <span>{state.encrypted[key]}</span>,
          </pre>
        ))}
        {'}'}
      </div>

      <style jsx>{`
        div {
          font-family: monospace;
          margin-top: 15;
          padding: 0 6%;
        }

        pre {
          margin: 0 15px;
          tab-size: 2;
          white-space: normal;
        }

        span {
          color: #9013fe;
        }
      `}</style>
    </>
  )
}
