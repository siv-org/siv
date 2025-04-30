import { useRouter } from 'next/router'
import { useReducer } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from '../vote/Footer'
import { AcceptedVotes } from './AcceptedVotes'
import { DecryptedVotes } from './DecryptedVotes'
import { InvalidatedVotes } from './InvalidatedVotes'
import { debug, Mixnet } from './Mixnet/Mixnet'
import { OnlyMixnet } from './OnlyMixnet'
import { Totals } from './Totals'
import { useElectionInfo } from './use-election-info'

export const ElectionStatusPage = (): JSX.Element => {
  const { election_id, hide_tallies } = useRouter().query as { election_id: string; hide_tallies?: string }
  const { ballot_design, election_homepage, election_title, esignature_requested, has_decrypted_votes } =
    useElectionInfo()
  const [show_encrypteds, toggle_encrypteds] = useReducer((state) => !state, false)

  if (debug) return <OnlyMixnet />

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

          {election_title && (
            <div>
              <h2>{election_title}</h2>

              {/* Optional Election Homepage link */}
              {election_homepage && (
                <p>
                  Election Homepage:{' '}
                  <a
                    className="font-semibold"
                    href={(election_homepage.startsWith('http') ? '' : 'http://') + election_homepage}
                    rel="noreferrer "
                    target="_blank"
                  >
                    {election_homepage}
                  </a>
                </p>
              )}
            </div>
          )}
          {/* Optionally hide vote tallies with ?hide_tallies=1 url param */}
          {!hide_tallies && <Totals />}
          <br />
          <DecryptedVotes />
          <br />

          {/* Display simple list of Encrypted Votes if we haven't unlocked any yet */}
          {/* If we have unlocked, display Collapsible */}
          {has_decrypted_votes && (
            <p className="toggle">
              <a onClick={toggle_encrypteds}>{show_encrypteds ? '[-] Hide' : '[+] Show'} Encrypted Submissions</a>
            </p>
          )}

          {(show_encrypteds || has_decrypted_votes === false) && (
            <div>
              {show_encrypteds && has_decrypted_votes && <Mixnet />}
              <AcceptedVotes {...{ ballot_design, esignature_requested, has_decrypted_votes }} />
              <InvalidatedVotes />
            </div>
          )}
        </div>
        <Footer />
      </main>

      <style jsx>{`
        main {
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;

          background: hsl(0, 0%, 95%);

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
        @media (max-width: 600px) {
          .title-line {
            flex-direction: column;
          }
          h1 {
            margin-bottom: 0;
          }
        }

        .title-line p {
          opacity: 0.7;
          text-align: right;
          margin-top: 0;
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
