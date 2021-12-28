import { darkBlue } from './colors'

export const NowPossible = () => (
  <section>
    <h2>Secure Internet Voting is now possible</h2>
    <p>
      <a href="/faq">Frequently Asked Questions</a>
    </p>
    <img src="/home3/dark-wave-background.gif" />
    <style jsx>{`
      section {
        padding-top: 16vw;
        text-align: center;
        position: relative;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      h2 {
        color: white;
        font-size: 4.5vw;
      }

      img {
        z-index: -1;
        position: absolute;
        top: 0;
        left: -16vw;
        right: -16vw;
        width: 120vw;
      }

      a {
        border: 0.25vw solid ${darkBlue}11;
        background-color: ${darkBlue}66;
        color: white;
        padding: 0.5vw 5vw;
        border-radius: 0.75vw;
        font-weight: 600;
        font-size: 1.75vw;

        display: inline-block;
        margin: 14vw 0 6vw;
      }

      a:hover {
        border-color: ${darkBlue};
        background-color: #000;
        text-decoration: none;
        color: white;
      }
    `}</style>
  </section>
)
