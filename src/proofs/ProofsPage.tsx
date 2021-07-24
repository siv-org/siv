import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { useBallotDesign } from '../status/use-ballot-design'
import { Footer } from '../vote/Footer'
import Process from './process.mdx'

export const ProofsPage = () => {
  const { election_id } = useRouter().query as { election_id?: string }
  const { election_title } = useBallotDesign(election_id)

  return (
    <>
      <Head title="Election Proofs" />

      <main>
        <div>
          <div className="title-line">
            <h1>Election `{election_title}` Proofs</h1>
            <p>
              ID: <b>{election_id}</b>
            </p>
          </div>
          <Process />
        </div>
        <Footer />
      </main>

      {/* Customize the default mdx rendering */}
      <style global jsx>{`
        ol {
          padding-inline-start: 20px;
        }

        ol li {
          font-weight: bold;
        }

        /* Formatting for checkboxes */
        ul.contains-task-list {
          padding-inline-start: 0px;
        }
        .task-list-item {
          display: block;
        }
        input[type='checkbox'] {
          width: 50px;
          text-align: right;
        }
        input[type='checkbox']:before {
          content: '(todo)';
          color: red;
        }
      `}</style>

      <style jsx>{`
        main {
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
      `}</style>
      <GlobalCSS />
    </>
  )
}
