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
  const ballot_design = useBallotDesign(election_id)
  const [show_encrypteds, toggle_encrypteds] = useReducer((state) => !state, false)

  return (
    <>
      <Head title="Election Status" />

      <main>
        <h1>Election Status</h1>
        <p>
          ID: <b>{election_id}</b>
        </p>
        <DecryptedVotes {...{ ballot_design }} />
        <p className="toggle">
          <a onClick={toggle_encrypteds}>{show_encrypteds ? '[-] Hide' : '[+] Show'} Encrypted Submissions</a>
        </p>
        <div style={{ display: show_encrypteds ? 'block' : 'none' }}>
          <AcceptedVotes {...{ ballot_design }} />
        </div>
        <Footer />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;
        }

        p.toggle {
          cursor: pointer;
          font-size: 12px;
          margin-top: 45px;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
