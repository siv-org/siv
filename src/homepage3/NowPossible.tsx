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
        padding-top: 8rem;
        text-align: center;
        position: relative;
        height: 100vh;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      h2 {
        color: white;
        font-size: 36px;
      }

      img {
        z-index: -1;
        position: absolute;
        top: 0;
        left: -8rem;
        right: -8rem;
        width: 120vw;
      }

      a {
        border: 2px solid ${darkBlue}11;
        background-color: ${darkBlue}66;
        color: white;
        padding: 4px 40px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;

        display: inline-block;
        margin: 3rem 0;
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
