import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from '../vote/Footer'
import { process } from './process'

export const ProofsPage = () => {
  const { election_id } = useRouter().query as { election_id?: string }

  let stepCount = 0

  return (
    <>
      <Head title="Election Proofs" />

      <main>
        <div>
          <div className="title-line">
            <h1>Election Proofs</h1>
            <p>
              ID: <b>{election_id}</b>
            </p>
          </div>
          {process.map((step, i) => {
            if (typeof step === 'string') return <p key={i}>{step}</p>

            if (typeof step === 'object') {
              if (step.html) return <div dangerouslySetInnerHTML={{ __html: step.html }} key={i} />

              //   if (step.react) {
              //     const Element = (step.react as ReactLine).react
              //     return <Element key={i} />
              //   }

              if (step.section) return <h2 key={i}>{step.section}:</h2>

              if (step.step)
                return (
                  <h4 key={i}>
                    {++stepCount}. {step.step}
                  </h4>
                )

              if (step.todo)
                return (
                  <p key={i}>
                    <input type="checkbox" />
                    <span style={{ color: 'red' }}>(todo)</span>
                    {step.todo}
                  </p>
                )
            }
          })}
        </div>
        <Footer />
      </main>

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

        p.toggle {
          font-size: 13px;
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
