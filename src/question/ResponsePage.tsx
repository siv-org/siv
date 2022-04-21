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
            padding: min(4vw, 30px);
            min-height: 100vh;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          h1 {
            font-size: min(7vw, 50px);
            margin-top: min(8vw, 15px);
            margin-bottom: 0;
          }

          h3 {
            font-size: min(5vw, 30.5px);
            margin-bottom: min(1vw, 7.5px);
          }

          h5 {
            opacity: 0.6;
            margin-top: 0;
            font-size: min(4vw, 25px);
          }

          textarea {
            width: 100%;
            min-height: min(34vw, 255px);
            resize: vertical;

            padding: 8px 10px;
            font-size: min(4vw, 25px);

            border-radius: 5px;
            background-color: #fffe;
            border: 1px solid #ccc;
          }

          button {
            margin-top: min(2vw, 12.5px);
            margin-bottom: min(15vw, 94px);

            font-size: min(4.3vw, 32px);
            padding: 9px 10px;
            width: 100%;

            background-color: #dff6ff;
            border: 2px solid #00b4ff;
            border-radius: 7px;

            color: #000a;
            font-weight: 700;
            letter-spacing: min(0.5vw, 3.75px);

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
