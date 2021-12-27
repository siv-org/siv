import { darkBlue } from './colors'

export const Privacy = () => (
  <section>
    <h2>Free and fair elections require strong privacy</h2>
    <h3>
      SIV offers Multi-Party Encryption and strong Cryptographic <br /> Shuffles so that no one can see how anyone
      votes.
    </h3>
    <h5>All while maintaining full auditability and verifability.</h5>
    <p>
      <a href="/faq#privacy">Learn More</a>
    </p>
    <img src="/home3/privacy-background.png" />
    <style jsx>{`
      section {
        margin-top: 5rem;
        text-align: center;
        color: ${darkBlue};
        position: relative;
        width: 100%;
      }

      h2 {
        font-size: 26px;
      }

      h3 {
        font-size: 22px;
        font-weight: 300;
      }

      h5 {
        font-size: 15px;
        font-weight: 300;
        margin-bottom: 5rem;
      }

      a {
        border: 2px solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 4px 120px;
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

      img {
        z-index: -1;
        position: absolute;
        top: 0;
        left: -8rem;
        right: -8rem;
        width: 120vw;
      }
    `}</style>
  </section>
)
