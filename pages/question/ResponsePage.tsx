import Head from 'next/head'
import { useRouter } from 'next/router'

export const ResponsePage = () => {
  const { push, query } = useRouter()
  const { q: question, req: min_required } = query
  const submitted = 0

  const remaining = +(min_required || 0) - submitted
  const met_goal = remaining <= 0

  return (
    <>
      <Head>
        <title>{question}</title>
        <meta content="Secure anonymous polling" property="og:description"></meta>
      </Head>
      <main>
        <div className="top">
          <h1>{question}</h1>
          <h5>
            {submitted} of {min_required} answers submitted
          </h5>

          <h3>Add your anonymous answer:</h3>
          <textarea />
          <button onClick={() => {}}>Submit</button>

          {!met_goal ? (
            <p className="waiting">
              Need {remaining} more answer{remaining !== 1 ? 's' : ''} before results unlocked.
            </p>
          ) : (
            <>
              <p>Submissions (order randomized):</p>
              {/* {shuffle(submissions).map((submission) => (
              <p>{submission}</p>
            ))} */}
            </>
          )}
        </div>
        <footer>
          <a onClick={() => push(`?`)}>Create your own</a>
        </footer>
        <style jsx>{`
          main {
            padding: 1rem;
            min-height: 100vh;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          h1 {
            font-size: 8vw;
            margin-top: 2vw;
            margin-bottom: 0;
          }

          h3 {
            font-size: 5vw;
            margin-bottom: 1vw;
          }

          h5 {
            opacity: 0.6;
            margin-top: 0;
            font-size: 4vw;
          }

          textarea {
            width: 100%;
            min-height: 34vw;
            resize: vertical;

            padding: 8px 10px;
            font-size: 4vw;

            border-radius: 5px;
            background-color: #fffe;
            border: 1px solid #ccc;
          }

          button {
            margin-top: 2vw;
            margin-bottom: 15vw;

            font-size: 4.3vw;
            padding: 9px 10px;
            width: 100%;

            background-color: #dff6ff;
            border: 2px solid #00b4ff;
            border-radius: 7px;

            color: #000a;
            font-weight: 700;
            letter-spacing: 0.5vw;

            cursor: pointer;
          }

          button:hover {
            background-color: #f1fafe;
          }

          .waiting {
            opacity: 0.7;
            text-align: center;
          }

          footer {
            text-align: center;
          }

          footer a {
            color: #0005;
            cursor: pointer;
            padding: 5px 10px;
          }
        `}</style>
      </main>
    </>
  )
}
