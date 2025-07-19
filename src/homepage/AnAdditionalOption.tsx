import Image from 'next/image'
import { Link } from 'react-scroll'

import { darkBlue } from './colors'

export const AnAdditionalOption = () => (
  <section>
    <h2>An Additional Voting Option</h2>
    <p>SIV works alongside paper methods, so voters can use their preference.</p>
    <ul>
      <li>
        <div>
          <Image alt="in person" height={1080} layout="responsive" priority src="/home3/methods-1.png" width={1920} />
        </div>
        In Person
      </li>
      <li>
        <div>
          <Image alt="by mail" height={1080} layout="responsive" priority src="/home3/methods-2.png" width={1920} />
        </div>
        By Mail
      </li>
      <li>
        <div>
          <Image alt="online" height={223} layout="responsive" priority src="/home3/methods-3.png" width={256} />
        </div>
        Online
      </li>
    </ul>
    <p>
      <Link id="help-bring-btn" offset={-25} smooth={true} to="let-your-govt-know">
        Help bring <span className="desktop">Secure Internet Voting</span>
        <span className="mobile">SIV</span> to your area
      </Link>
    </p>
    <style jsx>{`
      section {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h2 {
        color: ${darkBlue};
        font-size: 4vw;
        font-weight: 800;
      }

      p {
        font-size: 2.375vw;
      }

      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1240px;
        margin: 0 auto;
        padding-inline-start: 0;
      }

      li {
        list-style: none;
        position: relative;
        font-size: 2vw;
        margin: 15vw 8vw 0;
        text-align: center;
      }

      div {
        width: 10vw;
        position: absolute;
        top: -8vw;
      }

      li:nth-child(1) div {
        left: -1vw;
      }

      li:nth-child(2) div {
        left: -2vw;
      }

      li:nth-child(3) div {
        left: -1.8vw;
        top: -9vw;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        section {
          text-align: center;
        }

        h2 {
          font-size: 6vw;
        }

        p {
          font-size: 4.5vw;
        }

        ul {
          flex-direction: column;
          padding-top: 5vw;
        }

        li {
          font-size: 4vw;
          margin-bottom: 10vw;
        }

        div {
          width: 20vw;
          top: -15vw;
        }

        li:nth-child(1) div {
          left: -2vw;
        }

        li:nth-child(2) div {
          left: -4vw;
        }

        li:nth-child(3) div {
          left: -3.6vw;
          top: -18vw;
        }
      }
    `}</style>
    <style global jsx>{`
      #help-bring-btn {
        cursor: pointer;

        border: 0.25vw solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 0.5vw 5vw;
        border-radius: 0.75vw;
        border-radius: 6px;
        font-weight: 600;
        font-size: 1.875vw;
        transition: 0.1s background-color linear, 0.1s color linear;

        display: inline-block;
        margin: 6vw 0;
      }

      #help-bring-btn:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }

      #help-bring-btn span.mobile {
        display: none;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        #help-bring-btn {
          font-size: 3.5vw;
          padding: 1.5vw 12vw;
          margin-top: 0;
        }

        #help-bring-btn span.mobile {
          display: inline;
        }

        #help-bring-btn span.desktop {
          display: none;
        }
      }
    `}</style>
  </section>
)
