import { omit } from 'lodash'

import { useVoteContext } from './VoteContext'

export function EncryptedVote(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <>
      <div>
        {'{'}
        {Object.keys(omit(state.encrypted, 'token')).map((key) => (
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
        }

        span {
          color: #9013fe;
        }
      `}</style>
    </>
  )
}
