import Image from 'next/image'

import { darkBlue } from './colors'

export const OnePersonOneVote = () => (
  <section>
    <h2>
      One Person,
      <br /> One Vote
    </h2>
    <ul>
      <li>
        <div className="auth1">
          <Image height={597} src="/home3/auth-1.png" width={620} />
        </div>
        Voters can be authenticated by email, SMS, postal mail, drawn signatures, ID photos— in any preferred
        combination.
      </li>
      <li>
        <div className="auth2">
          <Image height={1080} src="/home3/auth-2.png" width={1920} />
        </div>
        Voter Authentication Tokens can be re-issued or revoked as necessary.
      </li>
      <li>
        <div className="auth3">
          <Image height={1080} src="/home3/auth-3.png" width={1920} />
        </div>
        The entire process creates a full audit trail for independent verification.
      </li>
    </ul>
    <style jsx>{`
      section {
        margin-top: 15vw;

        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      h2 {
        font-size: 4vw;
        width: 40%;
        color: ${darkBlue};
        font-weight: 800;
      }

      ul {
        width: 50%;
      }

      li {
        font-size: 2.5vw;
        margin: 6vw 0;
        font-weight: 500;
        position: relative;
        list-style: none;
      }

      div {
        position: absolute;
      }

      div.auth1 {
        width: 6.25vw;
        left: -8.75vw;
      }

      div.auth2 {
        width: 10vw;
        left: -10.625vw;
        transform: scaleX(-1);
      }

      div.auth3 {
        width: 11.25vw;
        left: -11.25vw;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        section {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        h2 br {
          display: none;
        }

        h2 {
          width: 100%;
          font-size: 6vw;
          margin-bottom: 0;
        }

        ul {
          padding-inline-start: 0;
          width: 100%;
        }

        li {
          font-size: 5vw;

          display: flex;
          align-items: center;
          flex-direction: column;
          margin-bottom: 9vw;
        }

        div {
          position: relative;
          left: 0 !important;
        }

        div.auth1 {
          width: 12.5vw;
        }

        div.auth2 {
          width: 20vw;
        }

        div.auth3 {
          width: 22.5vw;
        }
      }
    `}</style>
  </section>
)
