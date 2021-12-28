import Image from 'next/image'

import { darkBlue } from './colors'
import { HeaderBar } from './HeaderBar'

export const AboveFold = () => (
  <section>
    <HeaderBar />
    <h1>
      Secure Internet Voting
      <div className="underline-container">
        <Image height={810} layout="responsive" src="/home3/yellow-underline.gif" width={1440} />
      </div>
    </h1>
    <h2>Fast. Private. Verifiable.</h2>
    <div className="phone-container">
      <Image height={912} layout="responsive" src="/home3/above-interface.gif" width={464} />
    </div>
    <p>Millions of people want to be able to vote from their phones.</p>
    <div>
      <a className="button" href="/admin">
        Get Started
      </a>
      <a href="mailto:team@secureinternetvoting.org">Contact Team</a>
    </div>

    <style jsx>{`
      h1 {
        color: ${darkBlue};
        font-size: 4.5vw;
        margin-top: 10vw;
        font-weight: 800;
        letter-spacing: 0.075vw;
        position: relative;
      }

      .underline-container {
        width: 17vw;
        position: absolute;
        left: -0.65vw;
        top: 2vw;
        z-index: -10;
      }

      h2 {
        font-size: 2.5vw;
        margin-top: 4vw;
      }

      .phone-container {
        float: right;
        width: 25%;
        max-width: 300px;
        height: 80%;
        position: relative;
        top: -16vw;
        right: 2vw;
      }

      p {
        margin-top: 8vw;
        font-size: 1.75vw;
        font-weight: 700;
        margin-bottom: 3vw;
      }

      a.button {
        border: 0.25vw solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 0.5vw 6.25vw;
        border-radius: 0.75vw;
        margin-right: 3.75vw;
        transition: 0.1s background-color linear, 0.1s color linear;
      }

      a.button:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }

      a {
        font-size: 1.5vw;
        color: black;
        font-weight: 600;
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
          margin-top: 15vw;
        }

        .underline-container {
          width: 23.4vw;
        }

        h2 {
          font-size: 4.5vw;
          margin-top: 6vw;
        }

        .phone-container {
          float: none;
          top: 0;
          left: 0;
          margin: 5vw 0;
        }

        p {
          font-size: 3.5vw;
          text-align: center;
          margin-bottom: 10vw;
        }

        a {
          font-size: 3.5vw;
        }

        a.button {
          padding: 1.5vw 6.25vw;
        }
      }
    `}</style>
  </section>
)
