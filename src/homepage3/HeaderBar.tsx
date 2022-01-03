import Image from 'next/image'
import Link from 'next/link'
import blueUnderline from 'public/home3/blue-underline.png'

import { darkBlue } from './colors'

export const HeaderBar = () => (
  <header>
    <h3>SIV</h3>
    <span>
      <Link href="/faq">
        <a>FAQ</a>
      </Link>
      <Link href="/protocol">
        <a>Protocol</a>
      </Link>
      <Link href="/about">
        <a>Research</a>
      </Link>
      <Link href="/admin">
        <a>
          Sign In
          <div className="blue-underline">
            <Image layout="fill" src={blueUnderline} />
          </div>
        </a>
      </Link>
    </span>
    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        padding-top: 2vw;
      }

      h3 {
        margin: 0;
        color: ${darkBlue};
        font-size: 3vw;
      }

      a {
        color: ${darkBlue};
        text-decoration: none;
        padding: 0 1.5vw;
        margin: 0 0.4vw;
        font-size: 2vw;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      a:last-child {
        margin-left: 4vw;
        position: relative;
        padding-bottom: 1vw;
      }

      a:last-child:hover {
        text-decoration: none;
        filter: drop-shadow(0 0 7px ${darkBlue}3f);
      }

      .blue-underline {
        width: 12vw;
        height: 6vw;
        position: absolute;
        right: -1vw;
        left: -1vw;
        top: 0;
        z-index: -10;
      }

      /* 1-column for small screens */
      @media (max-width: 700px) {
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h3 {
          font-size: 8vw;
          margin-bottom: 3vw;
        }

        a {
          font-size: 4vw;
        }

        .blue-underline {
          width: 20vw;
          height: 10vw;
          top: 1vw;
        }
      }
    `}</style>
  </header>
)
