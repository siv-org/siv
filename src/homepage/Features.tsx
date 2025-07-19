import Image from 'next/image'

import { darkBlue } from './colors'

export const Features = () => (
  <section>
    <div className="row">
      <div>
        <span className="easy">
          <Image alt="easy" height={160} layout="responsive" priority src="/home3/features-1.gif" width={160} />
        </span>
        <h2>Easy To Use</h2>
        <p>Voters can vote from their preferred device in seconds, without needing to install anything.</p>
      </div>
      <div>
        <span className="quick">
          <Image alt="quick" height={110} layout="responsive" priority src="/home3/features-2.gif" width={110} />
        </span>
        <h2>Quick Results</h2>
        <p>Ballots can be submitted, confirmed, and tallied instantly.</p>
      </div>
      <div>
        <span className="verifiable">
          <Image alt="verifiable" height={170} layout="responsive" priority src="/home3/features-3.gif" width={170} />
        </span>
        <h2>Verifiable</h2>
        <p>Voters can personally verify that their vote was counted correctly & recount all votes themselves.</p>
      </div>
    </div>
    <p>
      <a href="/admin">Run a Secure Vote</a>
    </p>
    <style jsx>{`
      section {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      .row {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 1440px;
        text-align: center;
        margin: 5vw auto 0;
      }

      span {
        height: 9vw;
        display: block;
        position: relative;
        margin: 0 auto;
      }

      span.easy {
        position: relative;
        left: 2.2vw;
        width: 9vw;
      }

      span.quick {
        width: 6vw;
      }

      span.verifiable {
        position: relative;
        bottom: 3.3vw;
        left: 1.5vw;
        width: 9vw;
      }

      h2 {
        font-weight: 800;
        font-size: 2.4vw;
      }

      .row p {
        max-width: 25vw;
      }

      p {
        text-align: center;
        font-size: 1.7vw;
      }

      a {
        border: 0.25vw solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 0.5vw 10vw;
        border-radius: 0.75vw;
        font-weight: 600;
        font-size: 1.5vw;
        transition: 0.1s background-color linear, 0.1s color linear;

        display: inline-block;
        margin: 6vw 0;
      }

      a:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        .row {
          flex-direction: column;
          align-items: center;
          margin-top: 25vw;
        }

        span {
          height: 18vw;
        }

        span.easy {
          width: 18vw;
          left: 5vw;
        }

        span.quick {
          width: 12vw;
          top: 5vw;
        }

        span.verifiable {
          width: 18vw;
          top: 1vw;
          left: 3.5vw;
        }

        h2 {
          font-size: 5.5vw;
        }

        p {
          font-size: 3.4vw;
        }

        .row p {
          max-width: 75vw;
        }

        a {
          font-size: 3.5vw;
          padding: 1.5vw 10vw;
        }
      }
    `}</style>
  </section>
)
