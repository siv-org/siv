import { darkBlue } from './colors'
import { HeaderBar } from './HeaderBar'

export const AboveFold = () => (
  <section>
    <HeaderBar />
    <h1>
      Secure Internet Voting <img className="yellow" src="/home3/yellow-underline.gif" />
    </h1>
    <img className="interface" src="/home3/voter-interface.gif" />
    <h2>Fast. Private. Verifiable.</h2>
    <p>Millions of people want to be able to vote from their phones.</p>
    <div>
      <a className="button" href="/admin">
        Get Started
      </a>
      <a href="mailto:hi@secureinternetvoting.org">Contact Team</a>
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
        position: relative;
      }

      img.yellow {
        width: 125px;
        position: absolute;
        left: -5px;
        top: 16px;
        z-index: -10;
      }

      h2 {
        margin-top: 2rem;
        margin-bottom: 4rem;
      }

      img.interface {
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
        border: 2px solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 4px 50px;
        border-radius: 6px;
        margin-right: 30px;
      }

      a.button:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }

      a {
        color: black;
        font-weight: 600;
      }
    `}</style>
  </section>
)
