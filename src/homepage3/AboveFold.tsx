import { darkBlue } from './colors'
import { HeaderBar } from './HeaderBar'

export const AboveFold = () => (
  <section>
    <HeaderBar />
    <h1>Secure Internet Voting</h1>
    <img src="/home3/voter-interface.gif" />
    <h2>Fast. Private. Verifiable.</h2>
    <p>Millions of people want to be able to vote from their phones.</p>
    <div>
      <a className="button" href="/admin">
        Get Started
      </a>
      <a href="mailto:hi@secureinternetvoting.org">Contact Team →</a>
    </div>
    <style jsx>{`
      section {
        height: 100vh;
      }

      h1 {
        color: ${darkBlue};
        font-size: 33px;
        margin-top: 5rem;
        font-weight: 800;
        letter-spacing: 0.6px;
      }

      h2 {
        margin-top: 2rem;
        margin-bottom: 4rem;
      }

      img {
        float: right;
        width: 200px;
        position: relative;
        top: -5rem;
        right: -1.5rem;
      }

      p {
        font-weight: 700;
        margin-bottom: 1.5rem;
      }

      a.button {
        background-color: ${darkBlue};
        color: white;
        padding: 6px 50px;
        border-radius: 6px;
        margin-right: 30px;
      }

      a.button:hover {
        text-decoration: none;
        background: ${darkBlue}cc;
      }

      a {
        color: black;
        font-weight: 600;
      }
    `}</style>
  </section>
)
