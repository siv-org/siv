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
    <img src="/home3/privacy-background.gif" />
    <style jsx>{`
      section {
        margin-top: 10vw;
        text-align: center;
        color: ${darkBlue};
        position: relative;
        width: 100%;
      }

      h2 {
        font-size: 3.25vw;
      }

      h3 {
        font-size: 2.75vw;
        font-weight: 300;
      }

      h5 {
        font-size: 1.875vw;
        font-weight: 300;
        margin-bottom: 5rem;
      }

      a {
        border: 0.25vw solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 0.5vw 15vw;
        border-radius: 0.75vw;
        font-size: 1.5vw;
        font-weight: 600;
        transition: 0.1s background-color linear, 0.1s color linear;

        display: inline-block;
        margin: 3vw 0;
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
        left: -16vw;
        right: -16vw;
        width: 120vw;
      }
    `}</style>
  </section>
)
