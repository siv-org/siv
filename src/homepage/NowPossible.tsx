import Image from 'next/image'
import backgroundPurple from 'public/home3/background-purple.jpg'

import { darkBlue } from './colors'

export const NowPossible = () => (
  <section>
    <h2>Secure Internet Voting is now possible</h2>
    <p>
      <a href="/faq">Frequently Asked Questions</a>
    </p>
    <div>
      <Image layout="fill" placeholder="blur" src={backgroundPurple} />
    </div>
    <style jsx>{`
      section {
        padding-top: 22vw;
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

      a {
        border: 0.25vw solid ${darkBlue}11;
        background-color: ${darkBlue}bb;
        color: white;
        padding: 0.5vw 5vw;
        border-radius: 0.75vw;
        font-weight: 600;
        font-size: 1.75vw;
        transition: 0.1s background-color linear, 0.1s color linear;

        display: inline-block;
        margin: 12vw 0 4vw;
      }

      a:hover {
        background-color: #fff;
        border-color: ${darkBlue};
        color: ${darkBlue};
        text-decoration: none;
      }

      div {
        z-index: -1;
        position: absolute;
        top: 0;
        left: -16vw;
        right: -16vw;
        width: 120vw;
        height: 100%;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        h2 {
          font-size: 6.5vw;
        }

        a {
          font-size: 3.5vw;
          padding: 1.5vw 12vw;
          margin-top: 0;
        }
      }
    `}</style>
  </section>
)
