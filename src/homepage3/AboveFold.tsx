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
    <div className="phone-container">
      <Image height={1247} layout="responsive" src="/home3/voter-interface.gif" width={935} />
    </div>
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
        margin-bottom: 8vw;
      }

      .phone-container {
        float: right;
        width: 35%;
        max-width: 450px;
        height: 80%;
        position: relative;
        top: -10vw;
        right: -3vw;
      }

      p {
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
    `}</style>
  </section>
)
