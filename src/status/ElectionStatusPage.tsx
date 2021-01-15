import { useRouter } from 'next/router'
import { useReducer } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from '../vote/Footer'
import { AcceptedVotes } from './AcceptedVotes'
import { DecryptedVotes } from './DecryptedVotes'
import { useBallotDesign } from './use-ballot-design'

export const ElectionStatusPage = (): JSX.Element => {
  const { election_id } = useRouter().query as { election_id?: string }
  const { ballot_design, has_decrypted_votes } = useBallotDesign(election_id)
  const [show_encrypteds, toggle_encrypteds] = useReducer((state) => !state, false)

  return (
    <>
      <Head title="Election Status" />

      <main>
        <div>
          <div className="title-line">
            <h1>Election Status</h1>
            <p>
              ID: <b>{election_id}</b>
            </p>
          </div>
          <DecryptedVotes {...{ ballot_design }} />

          {/* Display simple list of Encrypted Votes if we haven't unlocked any yet */}
          {!has_decrypted_votes ? (
            <AcceptedVotes {...{ ballot_design }} />
          ) : (
            <>
              {/* If we have unlocked, display Collapsible */}
              <p className="toggle">
                <a onClick={toggle_encrypteds}>{show_encrypteds ? '[-] Hide' : '[+] Show'} Encrypted Submissions</a>
              </p>
              <div style={{ display: show_encrypteds ? 'block' : 'none' }}>
                <AcceptedVotes {...{ ballot_design }} />
              </div>{' '}
            </>
          )}
        </div>
        <Footer style={{ fontSize: 11 }} />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;

          /* Push footer to bottom */
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          justify-content: space-between;
        }

        .title-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .title-line p {
          opacity: 0.7;
          text-align: right;
        }

        p.toggle {
          font-size: 12px;
          opacity: 0.7;
          margin-top: 45px;
        }

        p.toggle a {
          cursor: pointer;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
