import Image from 'next/image'

import { darkBlue } from '../homepage/colors'
import { HeaderBar } from '../homepage/HeaderBar'

export const AboveFold = () => (
  <section>
    <HeaderBar />
    <h2>POWERING</h2>
    <h1>
      Secure Internet Voting
      <div className="underline-container">
        <Image height={810} layout="responsive" src="/home3/yellow-underline.gif" width={1440} />
      </div>
    </h1>

    <style jsx>{`
      h2 {
        font-size: 3vw;
        margin-top: 10vw;
        font-weight: 500;
        letter-spacing: 0.7vw;
      }

      h1 {
        color: ${darkBlue};
        font-size: 4.5vw;
        font-weight: 800;
        letter-spacing: 0.075vw;
        position: relative;
        margin-top: 0;
      }

      .underline-container {
        width: 17vw;
        position: absolute;
        left: -0.65vw;
        top: 2vw;
        z-index: -10;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          font-size: 6.2vw;
        }

        .underline-container {
          width: 23.4vw;
        }

        h2 {
          font-size: 4.5vw;
          margin-top: 20vw;
        }
      }

      /* fixed width for large screens */
      @media (min-width: 1440px) {
        section {
          max-width: 1440px;
          margin: 0 auto;
        }

        h1 {
          font-size: min(4.5vw, 85px);
        }

        .underline-container {
          width: min(17vw, 320px);
          top: min(2vw, 38px);
        }
      }
    `}</style>
  </section>
)
