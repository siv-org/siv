import { darkBlue } from './colors'

export const Features = () => (
  <section>
    <div className="row">
      <div>
        <span>
          <img className="phone" src="/home3/easy-to-use.gif" width="120px" />
        </span>
        <h2>Easy To Use</h2>
        <p>Voters can vote from their preferred device in seconds, without needing to install anything.</p>
      </div>
      <div>
        <span>
          <img src="/home3/quick-results.gif" width="100px" />
        </span>
        <h2>Quick Results</h2>
        <p>Ballots can be submitted, confirmed, and tallied instantly.</p>
      </div>
      <div>
        <span>
          <img className="check" src="/home3/verifiable.gif" width="140px" />
        </span>
        <h2>Verifiable</h2>
        <p>Voters can personally verify that their vote was counted correctly & recount all votes themselves.</p>
      </div>
    </div>
    <p>
      <a href="/admin">Run a Secure Vote</a>
    </p>
    <style jsx>{`
      .row {
        display: flex;
        justify-content: space-between;
        width: 100%;
        text-align: center;
      }

      span {
        height: 70px;
        display: block;
      }

      img.phone {
        position: relative;
        left: 1.1rem;
      }

      img.check {
        position: relative;
        bottom: 1.1rem;
      }

      h2 {
        font-weight: 800;
      }

      .row p {
        max-width: 200px;
      }

      p {
        text-align: center;
      }

      a {
        border: 2px solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 4px 70px;
        border-radius: 6px;
        font-weight: 600;

        display: inline-block;
        margin: 3rem 0;
      }

      a:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }
    `}</style>
  </section>
)
