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
          <Image height={1080} layout="responsive" src="/home3/methods-1.png" width={1920} />
        </div>
        In Person
      </li>
      <li>
        <div>
          <Image height={1080} layout="responsive" src="/home3/methods-2.png" width={1920} />
        </div>
        By Mail
      </li>
      <li>
        <div>
          <Image height={223} layout="responsive" src="/home3/methods-3.png" width={256} />
        </div>
        Online
      </li>
    </ul>
    <p>
      <Link id="help-bring-btn" offset={-25} smooth={true} to="let-your-govt-know">
        Help bring Secure Internet Voting to your area
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
      }

      div {
        width: 10vw;
        position: absolute;
        top: -8vw;
      }

      li:nth-child(1) div {
        left: -0.625vw;
      }

      li:nth-child(2) div {
        left: -1.625vw;
      }

      li:nth-child(3) div {
        left: -1.8vw;
        top: -9vw;
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

        display: inline-block;
        margin: 6vw 0;
      }

      #help-bring-btn:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }
    `}</style>
  </section>
)
