import Image from 'next/image'

import { darkBlue } from './colors'

export const Features = () => (
  <section>
    <div className="row">
      <div>
        <span className="easy">
          <Image height={810} layout="responsive" src="/home3/features-1.gif" width={1440} />
        </span>
        <h2>Easy To Use</h2>
        <p>Voters can vote from their preferred device in seconds, without needing to install anything.</p>
      </div>
      <div>
        <span className="quick">
          <Image height={810} layout="responsive" src="/home3/features-2.gif" width={1440} />
        </span>
        <h2>Quick Results</h2>
        <p>Ballots can be submitted, confirmed, and tallied instantly.</p>
      </div>
      <div>
        <span className="verifiable">
          <Image height={810} layout="responsive" src="/home3/features-3.gif" width={1440} />
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
        max-width: 1400px;
        text-align: center;
        margin: 10vw auto 0;
      }

      span {
        height: 8.5vw;
        display: block;
        position: relative;
        margin: 0 auto;
      }

      span.easy {
        position: relative;
        left: 2.2vw;
        width: 15vw;
      }

      span.quick {
        width: 12.5vw;
      }

      span.verifiable {
        position: relative;
        bottom: 2.2vw;
        left: 1.5vw;
        width: 17.5vw;
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
    `}</style>
  </section>
)
